import { useState } from 'react';
import { RotateCw, Calculator, Coffee, Bolt, Pulse, Receipt, Star, TrendingDown, TrendingUp } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { useT } from '../../../../lib/locale';
import { formatCompactMoney, formatMoney } from '../../../../lib/money';
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
  const t = useT();
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
    ? t('No comparison yet')
    : t(
        isPositive ? '{pct}% up vs yesterday' : '{pct}% down vs yesterday',
        { pct: Math.abs(comparison).toFixed(1) },
      );
  const chart = snapshot?.dailySales ?? Array.from(
    { length: 12 },
    (_, index) => ({
      businessDate: String(index + 1),
      netCentimes: 0,
      orderCount: 0,
    }),
  );
  const maximum = Math.max(...chart.map((day) => day.netCentimes), 0);
  const scaleMaximum = Math.max(maximum, 1);
  const peak = chart.reduce(
    (highest, day) =>
      day.netCentimes > highest.netCentimes ? day : highest,
    chart[0],
  );
  const bestSeller = today?.bestSeller;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <section className={styles.panel} aria-labelledby="sales-pulse-title">
      <header className={styles.panelHeader}>
        <div className={styles.title}>
          <Pulse width={18} height={18} aria-hidden="true" />
          <h1 id="sales-pulse-title">{t('Today’s pulse')}</h1>
        </div>
        <div className={styles.live}>
          <span />
          <strong>
            {error
              ? t('Unavailable')
              : isLoading
                ? t('Loading')
                : t('Saved · {date}', {
                    date: new Date(
                      `${snapshot?.businessDate}T12:00:00`,
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    }),
                  })}
          </strong>
        </div>
      </header>

      <div className={styles.accent} />
      <p className={styles.netLabel}>{t('NET SALES')}</p>
      <div className={styles.netRow}>
        <p className={styles.netValue}>
          {isLoading ? '—' : formatMoney(today?.netCentimes ?? 0)}
        </p>
        {error ? (
          <button type="button" className={styles.change} onClick={onRetry}>
            <RotateCw width={14} height={14} aria-hidden="true" />
            <strong>{t('Retry summary')}</strong>
          </button>
        ) : (
          <div className={styles.change}>
            <ComparisonIcon width={14} height={14} aria-hidden="true" />
            <strong>{isLoading ? t('Loading saved summary') : changeLabel}</strong>
          </div>
        )}
      </div>

      <div className={styles.summaryDividerTop} />
      <div className={styles.summary} aria-label={t('Today’s sales summary')}>
        {metrics.map(({ label, value, icon: Icon }, index) => (
          <div className={styles.metricSlot} key={label}>
            <div className={styles.metric}>
              <span className={styles.metricIcon}>
                <Icon width={17} height={17} aria-hidden="true" />
              </span>
              <span className={styles.metricCopy}>
                <strong>{value}</strong>
                <small>{t(label)}</small>
              </span>
            </div>
            {index < metrics.length - 1 ? <span className={styles.metricDivider} /> : null}
          </div>
        ))}
      </div>
      <div className={styles.summaryDividerBottom} />

      <div className={styles.chartHeader}>
        <span>
          <strong>{t('Sales rhythm')}</strong>
          <small>{t('Daily net sales')}</small>
        </span>
        <span className={styles.peak}>
          <Bolt width={14} height={14} aria-hidden="true" />
          <strong>
            {peak?.netCentimes
              ? t('Peak {date}', {
                  date: new Date(
                    `${peak.businessDate}T12:00:00`,
                  ).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  }),
                })
              : t('No sales in period')}
          </strong>
        </span>
      </div>

      <div className={styles.chart} aria-label={t('Daily net sales for the latest 12 days')}>
        <div className={styles.guides} aria-hidden="true">
          {[1, 0.75, 0.5, 0.25].map((ratio) => (
            <span key={ratio}>
              <small>{formatCompactMoney(maximum * ratio)}</small>
              <i />
            </span>
          ))}
        </div>
        <div className={styles.bars}>
          {chart.map((day) => {
            const isPeak = Boolean(peak?.netCentimes) && day === peak;
            const selected = selectedDate === day.businessDate;
            const amount = formatMoney(day.netCentimes);
            const intensity = day.netCentimes / scaleMaximum;
            const height = day.netCentimes
              ? Math.max(8, Math.round(intensity * 168))
              : 4;
            const tone = day.netCentimes
              ? Math.max(1, Math.ceil(intensity * 10))
              : 1;
            return (
            <button
              type="button"
              className={styles.barColumn}
              key={day.businessDate}
              aria-pressed={selected}
              aria-label={`${
                day.businessDate.length === 10
                  ? day.businessDate.slice(8)
                  : '—'
              }, ${amount}`}
              onClick={() => setSelectedDate(selected ? null : day.businessDate)}
            >
              <span
                className={`${styles.bar} ${styles[`tone${tone}`]} ${
                  isPeak ? styles.peakBar : ''
                }`}
                style={{ height }}
              >
                {selected ? <span className={styles.tip}>{amount}</span> : null}
              </span>
            </button>
          )})}
        </div>
        <div className={styles.axis}>
          {chart.map((day) => (
            <span
              className={
                peak?.netCentimes && day === peak ? styles.peakAxis : undefined
              }
              key={day.businessDate}
            >
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
            <small>{t('TODAY’S BEST SELLER')}</small>
            <strong>
              {isLoading
                ? t('Loading sales…')
                : error
                  ? t('Summary unavailable')
                  : bestSeller?.name ?? t('No sales yet')}
            </strong>
          </span>
        </div>
        <span className={styles.bestStats}>
          <strong>{formatMoney(bestSeller?.totalCentimes ?? 0)}</strong>
          <small>{t('{count} sold', { count: bestSeller?.quantity ?? 0 })}</small>
        </span>
      </div>
    </section>
  );
}
