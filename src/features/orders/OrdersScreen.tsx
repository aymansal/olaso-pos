import { useEffect, useState } from 'react';
import { useOrdersData } from '../../data/useOrdersData';
import type { ClockFormat } from '../../data/terminalSettings';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { OrderDetailPanel } from './components/OrderDetailPanel/OrderDetailPanel';
import { OrdersListPanel } from './components/OrdersListPanel/OrdersListPanel';
import styles from './OrdersScreen.module.css';

interface OrdersScreenProps {
  clockFormat: ClockFormat;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
  onSwitchStaff: () => Promise<boolean>;
}

export function OrdersScreen({
  clockFormat,
  onNavigate,
  onOpenSettings,
  onSwitchStaff,
}: OrdersScreenProps) {
  const data = useOrdersData();
  const [selectedKey, setSelectedKey] = useState<string>();
  const selectedOrder = data.orders.find((order) => order.key === selectedKey);
  useEffect(() => {
    if (!selectedOrder && data.orders[0]) {
      setSelectedKey(data.orders[0].key);
    }
  }, [data.orders, selectedOrder]);

  return (
    <main className={styles.screen} aria-label="Olaso orders">
      <Header
        activePage="Orders"
        clockFormat={clockFormat}
        onOpenSettings={onOpenSettings}
        onNavigate={onNavigate}
        onSwitchStaff={onSwitchStaff}
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
        reprinting={data.reprintingId === selectedOrder?.localSaleId}
        cancelling={data.cancellingId === selectedOrder?.localSaleId}
        onRetry={data.retrySync}
        onReprint={data.reprintReceipt}
        onCancel={data.cancelOrder}
      />
    </main>
  );
}
