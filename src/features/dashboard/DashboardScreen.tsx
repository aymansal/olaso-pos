import { useDashboardData } from '../../data/useDashboardData';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { RecentOrdersPanel } from './components/RecentOrdersPanel/RecentOrdersPanel';
import { SalesPulse } from './components/SalesPulse/SalesPulse';
import { StockAttentionPanel } from './components/StockAttentionPanel/StockAttentionPanel';
import styles from './DashboardScreen.module.css';

interface DashboardScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const data = useDashboardData();
  return (
    <main className={styles.screen} aria-label="Olaso operations dashboard">
      <SalesPulse
        snapshot={data.snapshot}
        isLoading={data.isLoading}
        error={data.error}
        onRetry={data.refresh}
      />
      <StockAttentionPanel
        warnings={data.snapshot?.warnings ?? []}
        isLoading={data.isLoading}
        error={data.error}
      />
      <RecentOrdersPanel
        orders={data.snapshot?.recentOrders ?? []}
        isLoading={data.isLoading}
        error={data.error}
        onViewAll={() => onNavigate?.('Orders')}
      />
    </main>
  );
}
