import {
  CalendarBlank,
  CaretDown,
  ChartLineUp,
  Package,
  Stack,
  Wallet,
} from '@phosphor-icons/react';
import { useState } from 'react';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import type { useCostManagement } from '../../../../data/useCostManagement';
import { shiftBusinessDate } from '../../../../lib/date';
import type { ReportTab } from '../../reportTypes';
import { ProductPerformanceTable } from '../ProductPerformanceTable/ProductPerformanceTable';
import { ReportsKpiStrip } from '../ReportsKpiStrip/ReportsKpiStrip';
import { SalesTrendChart } from '../SalesTrendChart/SalesTrendChart';
import { CostsPanel } from '../CostsPanel/CostsPanel';
import styles from './ReportsAnalyticsPanel.module.css';

const reportTabs = [
  { value: 'sales', label: 'Sales', icon: ChartLineUp },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'stock', label: 'Stock usage', icon: Stack },
  { value: 'costs', label: 'Costs', icon: Wallet },
] as const;

function dateRangeLabel(fromDate: string, toDate: string) {
  const from = new Date(`${fromDate}T12:00:00`);
  const to = new Date(`${toDate}T12:00:00`);
  return `${from.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })} – ${to.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function ReportsAnalyticsPanel({
  tab,
  onTabChange,
  fromDate,
  toDate,
  onRangeChange,
  snapshot,
  isLoading,
  error,
  onRetry,
  showCosts,
  costMonth,
  onCostMonthChange,
  costManagement,
}: {
  tab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  fromDate: string;
  toDate: string;
  onRangeChange: (range: { fromDate: string; toDate: string }) => void;
  snapshot?: ReportsSnapshot;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  showCosts: boolean;
  costMonth: string;
  onCostMonthChange: (month: string) => void;
  costManagement: ReturnType<typeof useCostManagement>;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(fromDate);
  const [draftTo, setDraftTo] = useState(toDate);
  const draftDays =
    Math.floor(
      (
        Date.parse(`${draftTo}T00:00:00.000Z`)
        - Date.parse(`${draftFrom}T00:00:00.000Z`)
      ) / 86_400_000,
    ) + 1;
  const validDraft = draftDays >= 1 && draftDays <= 31;

  function setQuickPeriod(days: number) {
    const next = {
      fromDate: shiftBusinessDate(toDate, 1 - days),
      toDate,
    };
    setDraftFrom(next.fromDate);
    setDraftTo(next.toDate);
    onRangeChange(next);
    setDateOpen(false);
  }

  return (
    <section className={styles.panel} aria-labelledby="reports-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="reports-title">Reports</h1>
          <small>Historical sales, products and stock performance</small>
        </span>
        <button
          className={styles.dateRange}
          type="button"
          aria-expanded={dateOpen}
          onClick={() => {
            setDraftFrom(fromDate);
            setDraftTo(toDate);
            setDateOpen((open) => !open);
          }}
        >
          <CalendarBlank size={15} aria-hidden="true" />
          <span>{dateRangeLabel(fromDate, toDate)}</span>
          <CaretDown size={12} aria-hidden="true" />
        </button>
      </header>

      {dateOpen ? (
        <div className={styles.dateMenu} aria-label="Report period">
          <span className={styles.quickPeriods}>
            <button type="button" onClick={() => setQuickPeriod(7)}>
              7 days
            </button>
            <button type="button" onClick={() => setQuickPeriod(30)}>
              30 days
            </button>
          </span>
          <label>
            <span>From</span>
            <input
              type="date"
              value={draftFrom}
              max={draftTo}
              onChange={(event) => setDraftFrom(event.target.value)}
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="date"
              value={draftTo}
              min={draftFrom}
              onChange={(event) => setDraftTo(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={styles.applyPeriod}
            disabled={!validDraft}
            title={validDraft ? undefined : 'Choose a period of 1 to 31 days'}
            onClick={() => {
              onRangeChange({
                fromDate: draftFrom,
                toDate: draftTo,
              });
              setDateOpen(false);
            }}
          >
            Apply
          </button>
        </div>
      ) : null}

      <nav className={styles.tabs} aria-label="Report type">
        {reportTabs.filter((item) => item.value !== 'costs' || showCosts).map(({ value, label, icon: Icon }) => {
          const active = value === tab;
          return (
          <button
            className={active ? styles.activeTab : ''}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onTabChange(value)}
            key={label}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </button>
        )})}
      </nav>

      {tab === 'costs' ? (
        <CostsPanel
          month={costMonth}
          onMonthChange={onCostMonthChange}
          management={costManagement}
        />
      ) : (
        <>
          <ReportsKpiStrip
            tab={tab}
            snapshot={snapshot}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
          <SalesTrendChart tab={tab} snapshot={snapshot} />
          <ProductPerformanceTable tab={tab} snapshot={snapshot} />
        </>
      )}
    </section>
  );
}
