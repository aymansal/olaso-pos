import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { StockDetailPanel } from './components/StockDetailPanel/StockDetailPanel';
import { StockInventoryPanel } from './components/StockInventoryPanel/StockInventoryPanel';
import styles from './StockScreen.module.css';

interface StockScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function StockScreen({ onNavigate }: StockScreenProps) {
  return (
    <main className={styles.screen} aria-label="Olaso stock">
      <Header
        activePage="Stock"
        brand="olaso"
        dateLabel="Friday, 24 July"
        dateTime="2026-07-24"
        onNavigate={onNavigate}
      />
      <StockInventoryPanel />
      <StockDetailPanel />
    </main>
  );
}
