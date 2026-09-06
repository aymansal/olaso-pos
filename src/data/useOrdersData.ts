import { useConvex } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { useConnectionStatus } from './connectionContext.tsx';
import { completeLocalSaleCancellation } from './localSales.ts';
import {
  countLocalOrders,
  loadLocalOrderPage,
  loadCurrentProductImages,
  loadLocalSyncSummary,
  ORDER_PAGE_SIZE,
  type OrderHistoryRecord,
  type OrderListFilter,
  type OrderStatus,
  type OrderStatusFilter,
} from './orderHistory.ts';
import { attemptSaleReceiptPrint } from './receiptPrinting.ts';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';
import { productImage } from '../lib/productImage.ts';

export type OrdersListQuery = {
  page: number;
  status: OrderStatusFilter;
  fromDate: string;
  toDate: string;
  query: string;
};

function listFilter(list: OrdersListQuery): OrderListFilter {
  return {
    ...(list.status === 'All'
      ? {}
      : { status: list.status.toLocaleLowerCase() as OrderStatus }),
    ...(list.fromDate ? { fromDate: list.fromDate } : {}),
    ...(list.toDate ? { toDate: list.toDate } : {}),
    ...(list.query.trim() ? { query: list.query } : {}),
  };
}

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
      ...(snapshot.receiptLanguage ? { receiptLanguage: snapshot.receiptLanguage } : {}),
      ...(snapshot.tenders ? {
        tenders: snapshot.tenders.map((tender) => ({
          ...tender,
          paymentMethod: tender.paymentMethod
            ?? (snapshot.paymentMethod === 'Card' ? 'Card' : 'Cash'),
        })),
      } : {}),
    },
  };
}

export function useOrdersData(list: OrdersListQuery) {
  const { available, foreground } = useConnectionStatus();
  const session = useStaffSession();
  const reconnect = useReconnect();
  const convex = useConvex();
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [reprintingId, setReprintingId] = useState<string>();
  const [cancellingId, setCancellingId] = useState<string>();
  const [message, setMessage] = useState('');
  const [lastSuccessAt, setLastSuccessAt] = useState<number>();
  const mounted = useRef(true);
  const fetchGeneration = useRef(0);
  const hasOrdersSnapshot = useRef(false);

  const refresh = useCallback(async () => {
    const initial = !hasOrdersSnapshot.current;
    if (initial) setIsLoading(true);
    setMessage('');
    const filter = listFilter(list);
    const offset = list.page * ORDER_PAGE_SIZE;
    const generation = fetchGeneration.current + 1;
    fetchGeneration.current = generation;
    const cloudHistory = list.page === 0 && available && foreground
      ? convex.query(api.sales.listOrders, {
          sessionToken: session.token,
          deviceId: session.deviceId,
          limit: ORDER_PAGE_SIZE,
        })
      : undefined;
    const [localResult, countResult, summaryResult, imageResult] = await Promise.allSettled([
      loadLocalOrderPage({
        limit: ORDER_PAGE_SIZE,
        offset,
        filter,
      }),
      countLocalOrders(filter),
      loadLocalSyncSummary(),
      loadCurrentProductImages(),
    ]);
    if (!mounted.current || generation !== fetchGeneration.current) return;
    const pageOrders =
      localResult.status === 'fulfilled' ? localResult.value.page : [];
    const errors: string[] = [];
    if (localResult.status === 'rejected') {
      errors.push('Local order history is unavailable.');
    }
    if (countResult.status === 'fulfilled') {
      setTotalCount(countResult.value);
    } else if (!hasOrdersSnapshot.current) {
      setTotalCount(pageOrders.length);
      errors.push('The order count is unavailable.');
    }
    if (summaryResult.status === 'fulfilled') {
      setLastSuccessAt(summaryResult.value.lastSuccessAt);
      if (summaryResult.value.lastError) {
        errors.push('Some saved orders still need synchronization.');
      }
    }
    if (imageResult.status === 'fulfilled') {
      setProductImages(Object.fromEntries(Object.entries(imageResult.value).map(
        ([id, image]) => [id, productImage(image.imageAssetKey, image.artworkKey, image.imageJpeg)],
      )));
    }
    setOrders(pageOrders);
    hasOrdersSnapshot.current = true;
    setMessage(errors[0] ?? '');
    setIsLoading(false);

    if (!cloudHistory) return;
    const [cloudResult] = await Promise.allSettled([cloudHistory]);
    if (!mounted.current || generation !== fetchGeneration.current) return;
    const backgroundErrors: string[] = [];
    if (cloudResult.status === 'fulfilled') {
      const allowed = new Set(pageOrders.map((order) => order.key));
      setOrders(
        mergeOrders(
          pageOrders,
          cloudResult.value.page.map(cloudOrder).filter((order) =>
            allowed.has(order.key)
          ),
        ),
      );
    } else {
      backgroundErrors.push(
        'Cloud history is unavailable; saved local orders remain visible.',
      );
    }
    if (!errors.length && backgroundErrors.length) {
      setMessage(backgroundErrors[0]);
    }
  }, [
    available,
    convex,
    foreground,
    list.fromDate,
    list.toDate,
    list.page,
    list.query,
    list.status,
    session.deviceId,
    session.token,
  ]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
    };
  }, [reconnect.revision, refresh, session.staffProfileId]);

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
          actorProfileId: session.staffProfileId,
          actorName: session.name,
        });
        reconnect.notifyLocalWrite();
        await refresh();
        setMessage('Correction saved locally and waiting to synchronize.');
        void reconnect.run('automatic').catch(() => undefined);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Order correction could not be saved.');
        throw error;
      } finally {
        if (mounted.current) setCancellingId(undefined);
      }
    },
    [reconnect, refresh, session.name, session.staffProfileId],
  );

  return {
    orders,
    totalCount,
    isLoading,
    reprintingId,
    cancellingId,
    message,
    lastSuccessAt,
    productImages,
    reprintReceipt,
    cancelOrder,
  };
}
