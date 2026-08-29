import { RotateCw, Calculator, Coffee, Bolt, Pulse, Receipt, Star, TrendingDown, TrendingUp } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { formatMoney } from '../../../../lib/money';
import styles from './SalesPulse.module.css';

export function SalesPulse({
  snapshot,
  isLoading,
  error,
  onRetry,
}: {
  snapshot?: DashboardSnapshot;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}) {
  const today = snapshot?.today;
  const yesterday = snapshot?.yesterday;
  const metrics = [
    {
      label: 'Orders',
      value: isLoading ? '—' : String(today?.orderCount ?? 0),
      icon: Receipt,
    },
    {
      label: 'Average order',
      value: isLoading
        ? '—'
        : formatMoney(
            today?.orderCount
              ? Math.round(today.netCentimes / today.orderCount)
              : 0,
          ),
      icon: Calculator,
    },
    {
      label: 'Items sold',
      value: isLoading ? '—' : String(today?.itemCount ?? 0),
      icon: Coffee,
    },
  ] as const;
  const comparison =
    yesterday && yesterday.netCentimes > 0
      ? (((today?.netCentimes ?? 0) - yesterday.netCentimes)
        / yesterday.netCentimes) * 100
      : undefined;
  const isPositive = comparison === undefined || comparison >= 0;
  const ComparisonIcon = isPositive ? TrendingUp : TrendingDown;
  const changeLabel = comparison === undefined
    ? 'No comparison yet'
    : `${Math.abs(comparison).toFixed(1)}% ${
        isPositive ? 'up' : 'down'
      } vs yesterday`;
  const chart = snapshot?.dailySales ?? Array.from(
    { length: 12 },
    (_, index) => ({
      businessDate: String(index + 1),
      netCentimes: 0,
      orderCount: 0,
    }),
  );
  const maximum = Math.max(...chart.map((day) => day.netCentimes), 1);
  const peak = chart.reduce(
    (highest, day) =>
      day.netCentimes > highest.netCentimes ? day : highest,
    chart[0],
  );
  const bestSeller = today?.bestSeller;

  return (
    <section className={styles.panel} aria-labelledby="sales-pulse-title">
      <header className={styles.panelHeader}>
        <div className={styles.title}>
          <Pulse width={18} height={18} aria-hidden="true" />
          <h1 id="sales-pulse-title">Today’s pulse</h1>
        </div>
        <div className={styles.live}>
          <span />
          <strong>
            {error
              ? 'Unavailable'
              : isLoading
                ? 'Loading'
                : `Saved · ${new Date(
                    `${snapshot?.businessDate}T12:00:00`,
                  ).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}`}
          </strong>
        </div>
      </header>

      <div className={styles.accent} />
      <p className={styles.netLabel}>NET SALES</p>
      <div className={styles.netRow}>
        <p className={styles.netValue}>
          {isLoading ? '—' : formatMoney(today?.netCentimes ?? 0)}
        </p>
        {error ? (
          <button type="button" className={styles.change} onClick={onRetry}>
            <RotateCw width={14} height={14} aria-hidden="true" />
            <strong>Retry summary</strong>
          </button>
        ) : (
          <div className={styles.change}>
            <ComparisonIcon width={14} height={14} aria-hidden="true" />
            <strong>{isLoading ? 'Loading saved summary' : changeLabel}</strong>
          </div>
        )}
      </div>

      <div className={styles.summaryDividerTop} />
      <div className={styles.summary} aria-label="Today’s sales summary">
        {metrics.map(({ label, value, icon: Icon }, index) => (
          <div className={styles.metricSlot} key={label}>
            <div className={styles.metric}>
              <span className={styles.metricIcon}>
                <Icon width={17} height={17} aria-hidden="true" />
              </span>
              <span className={styles.metricCopy}>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </div>
            {index < metrics.length - 1 ? <span className={styles.metricDivider} /> : null}
          </div>
        ))}
      </div>
      <div className={styles.summaryDividerBottom} />

      <div className={styles.chartHeader}>
        <span>
          <strong>Sales rhythm</strong>
          <small>Daily net sales</small>
        </span>
        <span className={styles.peak}>
          <Bolt width={14} height={14} aria-hidden="true" />
          <strong>
            {peak?.netCentimes
              ? `Peak ${new Date(
                  `${peak.businessDate}T12:00:00`,
                ).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}`
              : 'No sales in period'}
          </strong>
        </span>
      </div>

      <div className={styles.chart} aria-label="Daily net sales for the latest 12 days">
        <div className={styles.guides} aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className={styles.bars} aria-hidden="true">
          {chart.map((day) => {
            const intensity = day.netCentimes / maximum;
            const height = day.netCentimes
              ? Math.max(14, Math.round(intensity * 206))
              : 4;
            const tone = day.netCentimes
              ? Math.max(1, Math.ceil(intensity * 10))
              : 1;
            return (
            <span className={styles.barColumn} key={day.businessDate}>
              <span
                className={`${styles.bar} ${styles[`tone${tone}`]}`}
                style={{ height }}
              />
            </span>
          )})}
        </div>
        <div className={styles.axis}>
          {chart.map((day) => (
            <span key={day.businessDate}>
              {day.businessDate.length === 10
                ? day.businessDate.slice(8)
                : '—'}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.bestSellerDivider} />
      <div className={styles.bestSeller}>
        <div className={styles.bestProduct}>
          <span className={styles.bestIcon}>
            <Star width={18} height={18} aria-hidden="true" />
          </span>
          <span className={styles.bestCopy}>
            <small>TODAY’S BEST SELLER</small>
            <strong>
              {isLoading
                ? 'Loading sales…'
                : error
                  ? 'Summary unavailable'
                  : bestSeller?.name ?? 'No sales yet'}
            </strong>
          </span>
        </div>
        <span className={styles.bestStats}>
          <strong>{formatMoney(bestSeller?.totalCentimes ?? 0)}</strong>
          <small>{bestSeller?.quantity ?? 0} sold</small>
        </span>
      </div>
    </section>
  );
}
