import { useState } from 'react';
import { useReportsData } from '../../data/useReportsData';
import { useCostManagement } from '../../data/useCostManagement';
import { hasPermission } from '../../data/permissions';
import { useStaffSession } from '../../data/sessionContext';
import { localBusinessDate, shiftBusinessDate } from '../../lib/date';
import { ReportSummaryPanel } from './components/ReportSummaryPanel/ReportSummaryPanel';
import { ReportsAnalyticsPanel } from './components/ReportsAnalyticsPanel/ReportsAnalyticsPanel';
import type { ReportTab } from './reportTypes';
import styles from './ReportsScreen.module.css';

export function ReportsScreen() {
  const [range, setRange] = useState(() => {
    const toDate = localBusinessDate();
    return { fromDate: shiftBusinessDate(toDate, -6), toDate };
  });
  const [tab, setTab] = useState<ReportTab>('sales');
  const [costMonth, setCostMonth] = useState(() => localBusinessDate().slice(0, 7));
  const session = useStaffSession();
  const data = useReportsData(range.fromDate, range.toDate);
  const costs = useCostManagement(costMonth);
  return (
    <main className={styles.screen} aria-label="Olaso reports">
      <ReportsAnalyticsPanel
        tab={tab}
        onTabChange={setTab}
        fromDate={range.fromDate}
        toDate={range.toDate}
        onRangeChange={setRange}
        snapshot={data.snapshot}
        isLoading={data.isLoading}
        error={data.error}
        onRetry={data.retry}
        showCosts={hasPermission(session.role, 'expenses')}
        costMonth={costMonth}
        onCostMonthChange={setCostMonth}
        costManagement={costs}
      />
      <ReportSummaryPanel
        snapshot={data.snapshot}
        isLoading={data.isLoading}
        error={data.error}
      />
    </main>
  );
}
