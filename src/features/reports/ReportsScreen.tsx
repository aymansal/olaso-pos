import { useState } from 'react';
import { useReportsData } from '../../data/useReportsData';
import { useCostManagement } from '../../data/useCostManagement';
import { hasPermission } from '../../data/permissions';
import { useStaffSession } from '../../data/sessionContext';
import {
  calendarMonthEnd,
  calendarMonthOf,
  calendarMonthStart,
  localBusinessDate,
  reportChartMonth,
} from '../../lib/date';
import {
  presetRange,
  type PeriodPreset,
} from '../../components/PeriodCalendar/PeriodCalendar';
import { ReportSummaryPanel } from './components/ReportSummaryPanel/ReportSummaryPanel';
import { ReportsAnalyticsPanel } from './components/ReportsAnalyticsPanel/ReportsAnalyticsPanel';
import type { ReportTab } from './reportTypes';
import { useT } from '../../lib/locale';
import styles from './ReportsScreen.module.css';

export function ReportsScreen() {
  const t = useT();
  const [range, setRange] = useState<{
    fromDate: string;
    toDate: string;
    preset?: PeriodPreset;
  }>(() => ({ ...presetRange('thisWeek'), preset: 'thisWeek' }));
  const [tab, setTab] = useState<ReportTab>('sales');
  const session = useStaffSession();
  const today = localBusinessDate();
  const month = reportChartMonth(range.fromDate, range.toDate, today);
  const monthRange = {
    fromDate: calendarMonthStart(month),
    toDate: calendarMonthEnd(month),
  };
  const data = useReportsData(range.fromDate, range.toDate);
  const monthData = useReportsData(monthRange.fromDate, monthRange.toDate);
  const costs = useCostManagement((range.toDate || today).slice(0, 7));
  return (
    <main className={styles.screen} aria-label={t('Olaso reports')}>
      <div
        key={`${range.fromDate}:${range.toDate}:${tab}:${data.isLoading ? 'loading' : 'ready'}`}
        className={styles.fade}
      >
        <ReportsAnalyticsPanel
          tab={tab}
          onTabChange={setTab}
          fromDate={range.fromDate}
          toDate={range.toDate}
          preset={range.preset}
          onRangeChange={setRange}
          snapshot={data.snapshot}
          monthSnapshot={monthData.snapshot}
          chartMonth={month}
          isLoading={data.isLoading}
          error={data.error}
          onRetry={data.retry}
          showCosts={hasPermission(session.role, 'expenses')}
          showCompensation={hasPermission(session.role, 'compensation')}
          costManagement={costs}
        />
        <ReportSummaryPanel
          tab={tab}
          snapshot={data.snapshot}
          fromDate={range.fromDate}
          toDate={range.toDate}
          costManagement={costs}
          showCompensation={hasPermission(session.role, 'compensation')}
        />
      </div>
    </main>
  );
}
