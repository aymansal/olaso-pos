import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { ReportSummaryPanel } from './components/ReportSummaryPanel/ReportSummaryPanel';
import { ReportsAnalyticsPanel } from './components/ReportsAnalyticsPanel/ReportsAnalyticsPanel';
import styles from './ReportsScreen.module.css';

interface ReportsScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function ReportsScreen({ onNavigate }: ReportsScreenProps) {
  return (
    <main className={styles.screen} aria-label="Olaso reports">
      <Header
        activePage="Reports"
        brand="olaso"
        dateLabel="Friday, 24 July"
        dateTime="2026-07-24"
        onNavigate={onNavigate}
      />
      <ReportsAnalyticsPanel />
      <ReportSummaryPanel />
    </main>
  );
}
