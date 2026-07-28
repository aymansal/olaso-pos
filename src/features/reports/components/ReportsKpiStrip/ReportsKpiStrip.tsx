import {
  Calculator,
  CurrencyCircleDollar,
  Drop,
  Package,
  Receipt,
  ShoppingBag,
  Stack,
} from '@phosphor-icons/react';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import { formatMoney } from '../../../../lib/money';
import type { ReportTab } from '../../reportTypes';
import styles from './ReportsKpiStrip.module.css';

const kpiIcons = {
  currency: CurrencyCircleDollar,
  receipt: Receipt,
  calculator: Calculator,
  bag: ShoppingBag,
  package: Package,
  stock: Stack,
  drop: Drop,
} as const;

function change(
  current: number,
  previous: number,
): { label: string; tone: 'up' | 'down' | 'flat' } {
  if (previous === 0) return { label: 'No prior data', tone: 'flat' };
  const percent = ((current - previous) / previous) * 100;
  return {
    label: `${percent >= 0 ? '+' : '−'}${Math.abs(percent).toFixed(1)}%`,
    tone: percent >= 0 ? 'up' : 'down',
  };
}

export function ReportsKpiStrip({
  tab,
  snapshot,
  isLoading,
  error,
  onRetry,
}: {
  tab: ReportTab;
  snapshot?: ReportsSnapshot;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}) {
  if (isLoading || error) {
    return (
      <section
        className={styles.strip}
        aria-label="Report summary metrics"
      >
        <p className={styles.state} role={error ? 'alert' : 'status'}>
          {error || 'Loading saved report summaries…'}
          {error ? (
            <button type="button" onClick={onRetry}>Retry</button>
          ) : null}
        </p>
      </section>
    );
  }

  const current = snapshot?.current;
  const previous = snapshot?.previous;
  const currentAverage = current?.orderCount
    ? Math.round(current.netCentimes / current.orderCount)
    : 0;
  const previousAverage = previous?.orderCount
    ? Math.round(previous.netCentimes / previous.orderCount)
    : 0;
  const salesChange = change(
    current?.netCentimes ?? 0,
    previous?.netCentimes ?? 0,
  );
  const itemChange = change(
    current?.itemCount ?? 0,
    previous?.itemCount ?? 0,
  );
  const usageChange = change(
    current?.ingredientUsageEventCount ?? 0,
    previous?.ingredientUsageEventCount ?? 0,
  );
  const topProduct = current?.productTotals[0];
  const reportKpis = tab === 'sales'
    ? [
        { icon: 'currency', value: formatMoney(current?.netCentimes ?? 0), label: 'Net sales', change: salesChange },
        { icon: 'receipt', value: String(current?.orderCount ?? 0), label: 'Orders', change: change(current?.orderCount ?? 0, previous?.orderCount ?? 0) },
        { icon: 'calculator', value: formatMoney(currentAverage), label: 'Average order', change: change(currentAverage, previousAverage) },
        { icon: 'bag', value: String(current?.itemCount ?? 0), label: 'Items sold', change: itemChange },
      ]
    : tab === 'products'
      ? [
          { icon: 'currency', value: formatMoney(current?.netCentimes ?? 0), label: 'Product sales', change: salesChange },
          { icon: 'bag', value: String(current?.itemCount ?? 0), label: 'Units sold', change: itemChange },
          { icon: 'package', value: String(current?.productTotals.length ?? 0), label: 'Products sold', change: { label: 'Saved detail', tone: 'flat' as const } },
          { icon: 'calculator', value: current?.netCentimes && topProduct ? `${((topProduct.totalCentimes / current.netCentimes) * 100).toFixed(1)}%` : '0%', label: 'Top product share', change: { label: topProduct?.productName ?? 'No sales', tone: 'flat' as const } },
        ]
      : [
          { icon: 'stock', value: String(current?.ingredientUsageEventCount ?? 0), label: 'Recipe events', change: usageChange },
          { icon: 'drop', value: String(current?.ingredientTotals.length ?? 0), label: 'Ingredients used', change: { label: 'Exact base units', tone: 'flat' as const } },
          { icon: 'receipt', value: String(current?.orderCount ?? 0), label: 'Orders', change: change(current?.orderCount ?? 0, previous?.orderCount ?? 0) },
          { icon: 'calculator', value: String(snapshot?.range.days ?? 0), label: 'Period days', change: { label: 'Saved summaries', tone: 'flat' as const } },
        ];

  return (
    <section className={styles.strip} aria-label="Report summary metrics">
      {reportKpis.map(({ icon, value, label, change: metricChange }, index) => {
        const Icon = kpiIcons[icon as keyof typeof kpiIcons];

        return (
          <article className={styles.kpi} key={label}>
            {index > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
            <span className={styles.icon}><Icon size={14} aria-hidden="true" /></span>
            <span className={styles.copy}>
              <strong>{value}</strong>
              <span>
                <small>{label}</small>
                <small className={styles[metricChange.tone]}>
                  {metricChange.label}
                </small>
              </span>
            </span>
          </article>
        );
      })}
    </section>
  );
}
