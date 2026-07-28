import { useConvex, useMutation } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { SaleSyncPayload } from './localSales.ts';
import { syncPendingSales } from './localSales.ts';
import {
  loadLocalOrderPage,
  loadLocalSyncSummary,
  makeLocalSaleRetryAvailable,
  type LocalOrderCursor,
  type OrderHistoryRecord,
} from './orderHistory.ts';
import { toConvexSaleArgs } from './usePosData';

const PAGE_SIZE = 6;

function mergeOrders(
  existing: OrderHistoryRecord[],
  incoming: OrderHistoryRecord[],
) {
  const records = new Map(existing.map((order) => [order.key, order]));
  for (const order of incoming) records.set(order.key, order);
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
    receipt: {
      receiptNumber: snapshot.receiptNumber,
      completedAt: snapshot.completedAt,
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
  const convex = useConvex();
  const acceptMutation = useMutation(api.sales.accept);
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryingId, setRetryingId] = useState<string>();
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
      const result = await acceptMutation(toConvexSaleArgs(input));
      return {
        saleId: String(result.saleId),
        acknowledgedAt: result.acknowledgedAt,
      };
    },
    [acceptMutation],
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setMessage('');
    localCursor.current = undefined;
    cloudCursor.current = undefined;
    localDone.current = false;
    cloudDone.current = false;
    const sync = await syncPendingSales(acceptSale).catch(() => ({
      synced: 0,
      failed: 1,
    }));
    const [localResult, cloudResult, summaryResult] = await Promise.allSettled([
      loadLocalOrderPage({ limit: PAGE_SIZE }),
      convex.query(api.sales.listOrders, { limit: PAGE_SIZE }),
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
    if (cloudResult.status === 'fulfilled') {
      firstOrders.push(...cloudResult.value.page.map(cloudOrder));
      cloudCursor.current = cloudResult.value.continueCursor;
      cloudDone.current = cloudResult.value.isDone;
    } else {
      cloudDone.current = true;
      errors.push('Cloud history is unavailable; saved local orders remain visible.');
    }
    if (summaryResult.status === 'fulfilled') {
      setLastSuccessAt(summaryResult.value.lastSuccessAt);
      if (summaryResult.value.lastError) {
        errors.push('Some saved orders still need synchronization.');
      }
    }
    if (sync.failed > 0 && !errors.some((error) => error.includes('synchron'))) {
      errors.push('Some saved orders still need synchronization.');
    }
    setOrders(mergeOrders([], firstOrders));
    setMessage(errors[0] ?? '');
    setIsLoading(false);
  }, [acceptSale, convex]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const retryOnline = () => void refresh();
    window.addEventListener('online', retryOnline);
    return () => {
      mounted.current = false;
      window.removeEventListener('online', retryOnline);
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
  }, [convex]);

  const retrySync = useCallback(
    async (localSaleId: string) => {
      setRetryingId(localSaleId);
      setMessage('');
      try {
        await makeLocalSaleRetryAvailable(localSaleId);
        const result = await syncPendingSales(acceptSale);
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
    [acceptSale, refresh],
  );

  return {
    orders,
    isLoading,
    isLoadingMore,
    retryingId,
    message,
    lastSuccessAt,
    hasMore: !localDone.current || !cloudDone.current,
    loadMore,
    retrySync,
  };
}
