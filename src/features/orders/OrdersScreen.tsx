import { useEffect, useState } from 'react';
import {
  ORDER_PAGE_SIZE,
  type OrderStatusFilter,
} from '../../data/orderHistory';
import { useOrdersData } from '../../data/useOrdersData';
import { localBusinessDate } from '../../lib/date';
import { useT } from '../../lib/locale';
import type { PeriodPreset } from '../../components/PeriodCalendar/PeriodCalendar';
import { OrderDetailPanel } from './components/OrderDetailPanel/OrderDetailPanel';
import { OrdersListPanel } from './components/OrdersListPanel/OrdersListPanel';
import styles from './OrdersScreen.module.css';

export function OrdersScreen() {
  const t = useT();
  const today = localBusinessDate();
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatusFilter>('All');
  const [range, setRange] = useState<{
    fromDate: string;
    toDate: string;
    preset?: PeriodPreset;
  }>({ fromDate: today, toDate: today, preset: 'today' });
  const data = useOrdersData({
    page,
    status,
    fromDate: range.fromDate,
    toDate: range.toDate,
    query,
  });
  const [selectedKey, setSelectedKey] = useState<string>();
  const selectedOrder = data.orders.find((order) => order.key === selectedKey);
  const pageCount = Math.max(1, Math.ceil(data.totalCount / ORDER_PAGE_SIZE));
  const safePage = data.totalCount === 0 && page > 0
    ? page
    : Math.min(page, pageCount - 1);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    if (!selectedOrder && data.orders[0]) {
      setSelectedKey(data.orders[0].key);
    }
  }, [data.orders, selectedOrder]);

  return (
    <main className={styles.screen} aria-label={t('Olaso orders')}>
      <OrdersListPanel
        orders={data.orders}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        isLoading={data.isLoading}
        message={data.message}
        lastSuccessAt={data.lastSuccessAt}
        totalCount={data.totalCount}
        page={safePage}
        pageCount={pageCount}
        query={query}
        status={status}
        fromDate={range.fromDate}
        toDate={range.toDate}
        preset={range.preset}
        onQueryChange={(next) => {
          setQuery(next);
          setPage(0);
        }}
        onStatusChange={(next) => {
          setStatus(next);
          setPage(0);
        }}
        onRangeChange={(next) => {
          setRange(next);
          setPage(0);
        }}
        onPageChange={setPage}
      />
      <OrderDetailPanel
        order={selectedOrder}
        productImages={data.productImages}
        reprinting={data.reprintingId === selectedOrder?.localSaleId}
        cancelling={data.cancellingId === selectedOrder?.localSaleId}
        onReprint={data.reprintReceipt}
        onCancel={data.cancelOrder}
      />
    </main>
  );
}
