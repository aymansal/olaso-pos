import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { RecentOrdersPanel } from './components/RecentOrdersPanel/RecentOrdersPanel';
import { SalesPulse } from './components/SalesPulse/SalesPulse';
import { StockAttentionPanel } from './components/StockAttentionPanel/StockAttentionPanel';
import styles from './DashboardScreen.module.css';

interface DashboardScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <main className={styles.screen} aria-label="Olaso operations dashboard">
      <Header
        activePage="Dashboard"
        brand="olaso"
        dateLabel="Friday, 24 July"
        dateTime="2026-07-24"
        onNavigate={onNavigate}
      />
      <SalesPulse />
      <StockAttentionPanel />
      <RecentOrdersPanel />
    </main>
  );
}
