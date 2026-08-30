import { useEffect, useState } from 'react';
import {
  ORDER_PAGE_SIZE,
  type OrderStatusFilter,
} from '../../data/orderHistory';
import { useOrdersData } from '../../data/useOrdersData';
import { OrderDetailPanel } from './components/OrderDetailPanel/OrderDetailPanel';
import { OrdersListPanel } from './components/OrdersListPanel/OrdersListPanel';
import styles from './OrdersScreen.module.css';

export function OrdersScreen() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatusFilter>('All');
  const [businessDate, setBusinessDate] = useState('');
  const data = useOrdersData({ page, status, businessDate, query });
  const [selectedKey, setSelectedKey] = useState<string>();
  const selectedOrder = data.orders.find((order) => order.key === selectedKey);
  const pageCount = Math.max(1, Math.ceil(data.totalCount / ORDER_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    if (!selectedOrder && data.orders[0]) {
      setSelectedKey(data.orders[0].key);
    }
  }, [data.orders, selectedOrder]);

  return (
    <main className={styles.screen} aria-label="Olaso orders">
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
        businessDate={businessDate}
        onQueryChange={(next) => {
          setQuery(next);
          setPage(0);
        }}
        onStatusChange={(next) => {
          setStatus(next);
          setPage(0);
        }}
        onBusinessDateChange={(next) => {
          setBusinessDate(next);
          setPage(0);
        }}
        onPageChange={setPage}
      />
      <OrderDetailPanel
        order={selectedOrder}
        reprinting={data.reprintingId === selectedOrder?.localSaleId}
        cancelling={data.cancellingId === selectedOrder?.localSaleId}
        onReprint={data.reprintReceipt}
        onCancel={data.cancelOrder}
      />
    </main>
  );
}
