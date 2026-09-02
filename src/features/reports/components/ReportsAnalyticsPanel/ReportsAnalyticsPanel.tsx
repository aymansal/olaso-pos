import { Calendar, ChevronDown, ChartLine, Package, Layers, Wallet } from '@boxicons/react';
import { useState, type CSSProperties } from 'react';
import {
  PeriodCalendar,
  type PeriodPreset,
} from '../../../../components/PeriodCalendar/PeriodCalendar';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import type { useCostManagement } from '../../../../data/useCostManagement';
import { formatPeriodLabel } from '../../../../lib/date';
import { formatMoney } from '../../../../lib/money';
import { useLanguage, useT } from '../../../../lib/locale';
import { buildPeriodProfit } from '../../reportProfit';
import type { ReportTab } from '../../reportTypes';
import { SalesTrendChart } from '../SalesTrendChart/SalesTrendChart';
import { CostsPanel } from '../CostsPanel/CostsPanel';
import styles from './ReportsAnalyticsPanel.module.css';

const reportTabs = [
  { value: 'sales', label: 'Sales', icon: ChartLine },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'stock', label: 'Stock usage', icon: Layers },
  { value: 'costs', label: 'Costs', icon: Wallet },
] as const;

export function ReportsAnalyticsPanel({
  tab,
  onTabChange,
  fromDate,
  toDate,
  preset,
  onRangeChange,
  snapshot,
  monthSnapshot,
  chartMonth,
  isLoading,
  error,
  onRetry,
  showCosts,
  showCompensation,
  costManagement,
}: {
  tab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  fromDate: string;
  toDate: string;
  preset?: PeriodPreset;
  onRangeChange: (range: { fromDate: string; toDate: string; preset?: PeriodPreset }) => void;
  snapshot?: ReportsSnapshot;
  monthSnapshot?: ReportsSnapshot;
  chartMonth: string;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  showCosts: boolean;
  showCompensation: boolean;
  costManagement: ReturnType<typeof useCostManagement>;
}) {
  const t = useT();
  const language = useLanguage();
  const [dateAnchor, setDateAnchor] = useState<DOMRect>();
  const visibleTabs = reportTabs.filter((item) => item.value !== 'costs' || showCosts);
  const tabIndex = Math.max(0, visibleTabs.findIndex((item) => item.value === tab));
  const profit = buildPeriodProfit(
    snapshot,
    costManagement.saved,
    snapshot?.range.from ?? fromDate,
    snapshot?.range.to ?? toDate,
    showCompensation,
  );
  const current = snapshot?.current;
  const heroLabel = tab === 'sales'
    ? 'SALES'
    : tab === 'products'
      ? 'UNITS SOLD'
      : 'INGREDIENT TYPES USED';
  const heroValue = tab === 'sales'
    ? formatMoney(profit.revenueCentimes)
    : tab === 'products'
      ? String(current?.itemCount ?? 0)
      : String(current?.ingredientTypeCount ?? 0);

  return (
    <section className={styles.panel} aria-labelledby="reports-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="reports-title">{t('Reports')}</h1>
          <small>{t('Sales, products, stock, and costs')}</small>
        </span>
        <button
          className={styles.dateRange}
          type="button"
          aria-expanded={Boolean(dateAnchor)}
          onClick={(event) => {
            if (dateAnchor) {
              setDateAnchor(undefined);
              return;
            }
            setDateAnchor(event.currentTarget.getBoundingClientRect());
          }}
        >
          <Calendar width={15} height={15} aria-hidden="true" />
          <span>{fromDate || toDate ? formatPeriodLabel(fromDate, toDate, language) : t('All dates')}</span>
          <ChevronDown width={12} height={12} aria-hidden="true" />
        </button>
      </header>

      {dateAnchor ? (
        <PeriodCalendar
          mode="range"
          fromDate={fromDate}
          toDate={toDate}
          activePreset={preset}
          anchor={dateAnchor}
          presets={[
            'today',
            'yesterday',
            'thisWeek',
            'lastWeek',
            'thisMonth',
            'lastMonth',
            'all',
          ]}
          allowEmpty
          onChange={(range, nextPreset) => onRangeChange({ ...range, preset: nextPreset })}
          onClose={() => setDateAnchor(undefined)}
        />
      ) : null}

      <nav
        className={styles.tabs}
        style={{ '--count': visibleTabs.length, '--index': tabIndex } as CSSProperties}
        aria-label={t('Report type')}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {visibleTabs.map(({ value, label, icon: Icon }) => {
          const active = value === tab;
          return (
          <button
            className={active ? styles.activeTab : ''}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => onTabChange(value)}
            key={label}
          >
            <Icon width={14} height={14} aria-hidden="true" />
            <span>{t(label)}</span>
          </button>
        )})}
      </nav>

      {tab === 'costs' ? (
        <CostsPanel
          management={costManagement}
          showCompensation={showCompensation}
        />
      ) : (
        <>
          <section className={styles.hero} aria-label={t('Period total')}>
            <small>{t(heroLabel)}</small>
            <strong>
              {isLoading ? t('Loading…') : error ? t('Unavailable') : heroValue}
            </strong>
            {error ? (
              <button type="button" onClick={onRetry}>{t('Retry')}</button>
            ) : null}
          </section>
          <SalesTrendChart tab={tab} snapshot={monthSnapshot ?? snapshot} month={chartMonth} fillMonth />
        </>
      )}
    </section>
  );
}
