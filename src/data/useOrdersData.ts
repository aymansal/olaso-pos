import { useConvex, useMutation } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { SaleCancellationPayload, SaleSyncPayload } from './localSales.ts';
import { completeLocalSaleCancellation, syncPendingSales } from './localSales.ts';
import {
  loadLocalOrderPage,
  loadLocalSyncSummary,
  makeLocalSaleRetryAvailable,
  type LocalOrderCursor,
  type OrderHistoryRecord,
} from './orderHistory.ts';
import { toConvexSaleArgs } from './usePosData';
import { attemptSaleReceiptPrint } from './receiptPrinting.ts';
import { useStaffSession } from './sessionContext';

const PAGE_SIZE = 6;

function mergeOrders(
  existing: OrderHistoryRecord[],
  incoming: OrderHistoryRecord[],
) {
  const records = new Map(existing.map((order) => [order.key, order]));
  for (const order of incoming) {
    const current = records.get(order.key);
    records.set(order.key, current?.printState ? {
      ...order,
      printState: current.printState,
      printAttemptCount: current.printAttemptCount,
      ...(current.printError ? { printError: current.printError } : {}),
    } : order);
  }
  return [...records.values()].sort(
    (left, right) =>
      right.receipt.completedAt - left.receipt.completedAt
      || right.localSaleId.localeCompare(left.localSaleId),
  );
}

type CloudOrder =
  FunctionReturnType<typeof api.sales.listOrders>['page'][number];

function cloudOrder(sale: CloudOrder): OrderHistoryRecord {
  const snapshot = sale.receiptSnapshot;
  return {
    key: `${sale.deviceId}:${sale.localSaleId}`,
    deviceId: sale.deviceId,
    localSaleId: sale.localSaleId,
    cloudSaleId: String(sale.id),
    businessDate: sale.businessDate,
    ...(sale.cashierName ? { cashierName: sale.cashierName } : {}),
    status: sale.status,
    syncState: 'synced',
    syncAttemptCount: 0,
    printAttemptCount: 0,
    receipt: {
      receiptNumber: snapshot.receiptNumber,
      completedAt: snapshot.completedAt,
      ...(sale.cashierName ? { cashierName: sale.cashierName } : {}),
      serviceType:
        snapshot.serviceMode === 'online'
          ? 'order-online'
          : snapshot.serviceMode,
      ...(snapshot.customerName
        ? { customerName: snapshot.customerName }
        : {}),
      ...(snapshot.tableLabel ? { tableLabel: snapshot.tableLabel } : {}),
      lines: snapshot.lines,
      subtotalCentimes: snapshot.subtotalCentimes,
      discountCentimes: snapshot.discountCentimes,
      taxCentimes: snapshot.taxCentimes,
      totalCentimes: snapshot.totalCentimes,
      taxPolicyLabel: snapshot.taxPolicyLabel,
      paymentMethod: snapshot.paymentMethod,
    },
  };
}

export function useOrdersData() {
  const session = useStaffSession();
  const convex = useConvex();
  const acceptMutation = useMutation(api.sales.accept);
  const cancelMutation = useMutation(api.sales.cancel);
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryingId, setRetryingId] = useState<string>();
  const [reprintingId, setReprintingId] = useState<string>();
  const [cancellingId, setCancellingId] = useState<string>();
  const [message, setMessage] = useState('');
  const [lastSuccessAt, setLastSuccessAt] = useState<number>();
  const mounted = useRef(true);
  const loadingMore = useRef(false);
  const localCursor = useRef<LocalOrderCursor | undefined>(undefined);
  const cloudCursor = useRef<string | undefined>(undefined);
  const localDone = useRef(false);
  const cloudDone = useRef(false);

  const acceptSale = useCallback(
    async (input: SaleSyncPayload) => {
      const result = await acceptMutation({
        ...toConvexSaleArgs(input),
        sessionToken: session.token,
      });
      return {
        saleId: String(result.saleId),
        acknowledgedAt: result.acknowledgedAt,
      };
    },
    [acceptMutation, session.token],
  );

  const cancelSale = useCallback(
    async (input: SaleCancellationPayload) => {
      const result = await cancelMutation({ ...input, sessionToken: session.token });
      return result.kind === 'original-pending'
        ? result
        : { kind: 'cancelled' as const, correctionId: String(result.correctionId), acknowledgedAt: result.acknowledgedAt };
    },
    [cancelMutation, session.token],
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setMessage('');
    localCursor.current = undefined;
    cloudCursor.current = undefined;
    localDone.current = false;
    cloudDone.current = false;
    const synchronization = syncPendingSales(acceptSale, cancelSale).catch(() => ({
      synced: 0,
      failed: 1,
    }));
    const cloudHistory = convex.query(api.sales.listOrders, {
      sessionToken: session.token,
      deviceId: session.deviceId,
      limit: PAGE_SIZE,
    });
    const [localResult, summaryResult] = await Promise.allSettled([
      loadLocalOrderPage({ limit: PAGE_SIZE }),
      loadLocalSyncSummary(),
    ]);
    if (!mounted.current) return;
    const firstOrders: OrderHistoryRecord[] = [];
    const errors: string[] = [];
    if (localResult.status === 'fulfilled') {
      firstOrders.push(...localResult.value.page);
      localCursor.current = localResult.value.continueCursor;
      localDone.current = localResult.value.isDone;
    } else {
      localDone.current = true;
      errors.push('Local order history is unavailable.');
    }
    if (summaryResult.status === 'fulfilled') {
      setLastSuccessAt(summaryResult.value.lastSuccessAt);
      if (summaryResult.value.lastError) {
        errors.push('Some saved orders still need synchronization.');
      }
    }
    setOrders(mergeOrders([], firstOrders));
    setMessage(errors[0] ?? '');
    setIsLoading(false);

    void Promise.allSettled([cloudHistory, synchronization]).then(
      ([cloudResult, syncResult]) => {
        if (!mounted.current) return;
        const backgroundErrors: string[] = [];
        if (cloudResult.status === 'fulfilled') {
          cloudCursor.current = cloudResult.value.continueCursor;
          cloudDone.current = cloudResult.value.isDone;
          setOrders((current) =>
            mergeOrders(current, cloudResult.value.page.map(cloudOrder))
          );
        } else {
          cloudDone.current = true;
          backgroundErrors.push(
            'Cloud history is unavailable; saved local orders remain visible.',
          );
        }
        if (
          (
            syncResult.status === 'rejected'
            || syncResult.value.failed > 0
          )
          && !errors.some((error) => error.includes('synchron'))
        ) {
          backgroundErrors.push(
            'Some saved orders still need synchronization.',
          );
        }
        if (!errors.length && backgroundErrors.length) {
          setMessage(backgroundErrors[0]);
        }
      },
    );
  }, [acceptSale, cancelSale, convex, session.deviceId, session.token]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
    };
  }, [refresh]);

  const loadMore = useCallback(async () => {
    if (loadingMore.current || (localDone.current && cloudDone.current)) return;
    loadingMore.current = true;
    setIsLoadingMore(true);
    const requests: Array<Promise<OrderHistoryRecord[]>> = [];
    if (!localDone.current) {
      requests.push(
        loadLocalOrderPage({
          limit: PAGE_SIZE,
          cursor: localCursor.current,
        }).then((result) => {
          localCursor.current = result.continueCursor;
          localDone.current = result.isDone;
          return result.page;
        }),
      );
    }
    if (!cloudDone.current) {
      requests.push(
        convex
          .query(api.sales.listOrders, {
            sessionToken: session.token,
            deviceId: session.deviceId,
            limit: PAGE_SIZE,
            ...(cloudCursor.current ? { cursor: cloudCursor.current } : {}),
          })
          .then((result) => {
            cloudCursor.current = result.continueCursor;
            cloudDone.current = result.isDone;
            return result.page.map(cloudOrder);
          }),
      );
    }
    const results = await Promise.allSettled(requests);
    if (mounted.current) {
      const incoming = results.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : []
      );
      setOrders((current) => mergeOrders(current, incoming));
      if (results.some((result) => result.status === 'rejected')) {
        setMessage('More history could not be loaded. Try again when online.');
      }
      setIsLoadingMore(false);
    }
    loadingMore.current = false;
  }, [convex, session.deviceId, session.token]);

  const retrySync = useCallback(
    async (localSaleId: string) => {
      setRetryingId(localSaleId);
      setMessage('');
      try {
        await makeLocalSaleRetryAvailable(localSaleId);
        const result = await syncPendingSales(acceptSale, cancelSale);
        if (result.failed > 0) {
          setMessage('The order is still saved locally and waiting to sync.');
        }
        await refresh();
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Order synchronization could not be retried.',
        );
      } finally {
        if (mounted.current) setRetryingId(undefined);
      }
    },
    [acceptSale, cancelSale, refresh],
  );

  const reprintReceipt = useCallback(
    async (order: OrderHistoryRecord) => {
      if (!order.printState) {
        setMessage('Reprint is unavailable because this sale is not saved on this tablet.');
        return;
      }
      setReprintingId(order.localSaleId);
      setMessage('Sending the saved receipt…');
      try {
        const outcome = await attemptSaleReceiptPrint({
          localSaleId: order.localSaleId,
          receipt: order.receipt,
        });
        await refresh();
        setMessage(outcome.message);
      } finally {
        if (mounted.current) setReprintingId(undefined);
      }
    },
    [refresh],
  );

  const cancelOrder = useCallback(
    async (order: OrderHistoryRecord, reason: string) => {
      setCancellingId(order.localSaleId);
      setMessage('');
      try {
        await completeLocalSaleCancellation({
          originalLocalSaleId: order.localSaleId,
          reason,
          actorName: session.name,
        });
        const result = await syncPendingSales(acceptSale, cancelSale);
        await refresh();
        setMessage(result.failed > 0
          ? 'Correction saved locally and waiting to synchronize.'
          : 'Order cancelled. Record a replacement sale if needed.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Order correction could not be saved.');
        throw error;
      } finally {
        if (mounted.current) setCancellingId(undefined);
      }
    },
    [acceptSale, cancelSale, refresh, session.name],
  );

  return {
    orders,
    isLoading,
    isLoadingMore,
    retryingId,
    reprintingId,
    cancellingId,
    message,
    lastSuccessAt,
    hasMore: !localDone.current || !cloudDone.current,
    loadMore,
    retrySync,
    reprintReceipt,
    cancelOrder,
  };
}
