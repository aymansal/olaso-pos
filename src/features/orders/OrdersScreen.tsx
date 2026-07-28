import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { OrderDetailPanel } from './components/OrderDetailPanel/OrderDetailPanel';
import { OrdersListPanel } from './components/OrdersListPanel/OrdersListPanel';
import styles from './OrdersScreen.module.css';

interface OrdersScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function OrdersScreen({ onNavigate }: OrdersScreenProps) {
  return (
    <main className={styles.screen} aria-label="Olaso orders">
      <Header
        activePage="Orders"
        brand="olaso"
        dateLabel="Friday, 24 July"
        dateTime="2026-07-24"
        onNavigate={onNavigate}
      />
      <OrdersListPanel />
      <OrderDetailPanel />
    </main>
  );
}
