import {
  CalendarBlank,
  CaretDown,
  ChartLineUp,
  Package,
  Stack,
} from '@phosphor-icons/react';
import { ProductPerformanceTable } from '../ProductPerformanceTable/ProductPerformanceTable';
import { ReportsKpiStrip } from '../ReportsKpiStrip/ReportsKpiStrip';
import { SalesTrendChart } from '../SalesTrendChart/SalesTrendChart';
import styles from './ReportsAnalyticsPanel.module.css';

const reportTabs = [
  { label: 'Sales', icon: ChartLineUp, active: true },
  { label: 'Products', icon: Package, active: false },
  { label: 'Stock usage', icon: Stack, active: false },
] as const;

export function ReportsAnalyticsPanel() {
  return (
    <section className={styles.panel} aria-labelledby="reports-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="reports-title">Reports</h1>
          <small>Historical sales, products and stock performance</small>
        </span>
        <button className={styles.dateRange} type="button">
          <CalendarBlank size={15} aria-hidden="true" />
          <span>01 Jul – 24 Jul 2026</span>
          <CaretDown size={12} aria-hidden="true" />
        </button>
      </header>

      <nav className={styles.tabs} aria-label="Report type">
        {reportTabs.map(({ label, icon: Icon, active }) => (
          <button
            className={active ? styles.activeTab : ''}
            type="button"
            aria-current={active ? 'page' : undefined}
            key={label}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <ReportsKpiStrip />
      <SalesTrendChart />
      <ProductPerformanceTable />
    </section>
  );
}
