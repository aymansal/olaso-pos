import { useEffect, useState } from 'react';
import { useOrdersData } from '../../data/useOrdersData';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { OrderDetailPanel } from './components/OrderDetailPanel/OrderDetailPanel';
import { OrdersListPanel } from './components/OrdersListPanel/OrdersListPanel';
import styles from './OrdersScreen.module.css';

interface OrdersScreenProps {
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

export function OrdersScreen({
  onNavigate,
  onOpenSettings,
}: OrdersScreenProps) {
  const data = useOrdersData();
  const [selectedKey, setSelectedKey] = useState<string>();
  const selectedOrder = data.orders.find((order) => order.key === selectedKey);
  const now = new Date();

  useEffect(() => {
    if (!selectedOrder && data.orders[0]) {
      setSelectedKey(data.orders[0].key);
    }
  }, [data.orders, selectedOrder]);

  return (
    <main className={styles.screen} aria-label="Olaso orders">
      <Header
        activePage="Orders"
        brand="olaso"
        onOpenSettings={onOpenSettings}
        dateLabel={now.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
        dateTime={now.toISOString().slice(0, 10)}
        onNavigate={onNavigate}
      />
      <OrdersListPanel
        orders={data.orders}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        isLoading={data.isLoading}
        isLoadingMore={data.isLoadingMore}
        hasMore={data.hasMore}
        onLoadMore={data.loadMore}
        message={data.message}
        lastSuccessAt={data.lastSuccessAt}
      />
      <OrderDetailPanel
        order={selectedOrder}
        retrying={data.retryingId === selectedOrder?.localSaleId}
        onRetry={data.retrySync}
      />
    </main>
  );
}
