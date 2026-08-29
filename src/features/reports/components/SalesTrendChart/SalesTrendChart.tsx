import { useEffect, useState } from 'react';
import { TrendingUp } from '@boxicons/react';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import { formatCompactMoney, formatMoney } from '../../../../lib/money';
import type { ReportTab } from '../../reportTypes';
import styles from './SalesTrendChart.module.css';

function metricValue(
  point: ReportsSnapshot['daily'][number],
  tab: ReportTab,
) {
  if (tab === 'sales') return point.netCentimes;
  if (tab === 'products') return point.itemCount;
  return point.ingredientUsageEventCount;
}

function compactValue(value: number, tab: ReportTab) {
  if (tab !== 'sales') return String(Math.round(value));
  return formatCompactMoney(value);
}

function averageValue(value: number, tab: ReportTab) {
  if (tab === 'sales') return compactValue(value, tab);
  return new Intl.NumberFormat('en-MA', {
    maximumFractionDigits: 1,
  }).format(value);
}

export function SalesTrendChart({
  tab,
  snapshot,
}: {
  tab: ReportTab;
  snapshot?: ReportsSnapshot;
}) {
  const daily = snapshot?.daily ?? [];
  const bucketSize = Math.max(1, Math.ceil(daily.length / 12));
  const points = Array.from(
    { length: Math.ceil(daily.length / bucketSize) },
    (_, index) => {
      const days = daily.slice(
        index * bucketSize,
        (index + 1) * bucketSize,
      );
      return {
        label: days.at(-1)?.businessDate.slice(8) ?? '—',
        fromDate: days[0]?.businessDate,
        toDate: days.at(-1)?.businessDate,
        value: days.reduce(
          (total, point) => total + metricValue(point, tab),
          0,
        ),
      };
    },
  );
  const maximum = Math.max(...points.map((point) => point.value), 0);
  const scaleMaximum = Math.max(maximum, 1);
  const peak = points.reduce(
    (highest, point) => point.value > highest.value ? point : highest,
    {
      label: '—',
      value: 0,
      fromDate: undefined as string | undefined,
      toDate: undefined as string | undefined,
    },
  );
  const average = daily.length
    ? daily.reduce(
        (total, point) => total + metricValue(point, tab),
        0,
      ) / daily.length
    : 0;
  const title = tab === 'sales'
    ? 'Net sales trend'
    : tab === 'products'
      ? 'Units sold trend'
      : 'Recipe usage activity';
  const metricSubtitle = tab === 'sales'
    ? 'Daily saved net sales'
    : tab === 'products'
      ? 'Daily saved item quantities'
      : 'Daily ingredient deduction events';
  const subtitle = bucketSize === 1
    ? metricSubtitle
    : `${bucketSize}-day buckets · ${metricSubtitle}`;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    setSelectedKey(null);
  }, [tab]);

  return (
    <section className={styles.chart} aria-labelledby="report-trend-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="report-trend-title">{title}</h2>
          <small>{subtitle}</small>
        </span>
        <span className={styles.legend}>
          <span><i className={styles.currentDot} />Current period</span>
          <span><i className={styles.previousDot} />Saved summaries</span>
        </span>
      </header>

      <div className={styles.guides} aria-hidden="true">
        {[1, 0.75, 0.5, 0.25].map((ratio) => (
          <span key={ratio}>
            <small>{compactValue(maximum * ratio, tab)}</small><i />
          </span>
        ))}
      </div>

      <div
        className={styles.bars}
        aria-label={`${title} by saved ${
          bucketSize === 1 ? 'day' : 'period bucket'
        }`}
      >
        {points.map((point) => {
          const isPeak = point.value > 0 && point === peak;
          const selected = selectedKey === point.toDate;
          const amount = tab === 'sales'
            ? formatMoney(point.value)
            : compactValue(point.value, tab);
          return (
          <button
            type="button"
            className={styles.barGroup}
            key={point.toDate}
            aria-pressed={selected}
            aria-label={`${point.label}, ${amount}`}
            onClick={() => setSelectedKey(selected ? null : point.toDate ?? null)}
          >
            <i
              className={`${styles.bar} ${isPeak ? styles.peakBar : ''}`}
              style={{
                height: point.value
                  ? Math.max(
                      8,
                      Math.round((point.value / scaleMaximum) * 124),
                    )
                  : 4,
              }}
            >
              {selected ? <span className={styles.tip}>{amount}</span> : null}
              {isPeak ? (
                <span className={styles.peakCap} aria-hidden="true" />
              ) : null}
            </i>
            <small className={isPeak ? styles.peakLabel : ''}>
              {point.label}
            </small>
          </button>
        )})}
      </div>

      <footer className={styles.footer}>
        <span>
          <TrendingUp width={12} height={12} aria-hidden="true" />
          {peak.value && peak.toDate
            ? `Peak ${
                peak.fromDate !== peak.toDate
                  ? `${new Date(
                      `${peak.fromDate}T12:00:00`,
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}–${new Date(
                      `${peak.toDate}T12:00:00`,
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}`
                  : new Date(
                      `${peak.toDate}T12:00:00`,
                    ).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })
              } · ${
                tab === 'sales'
                  ? formatMoney(peak.value)
                  : compactValue(peak.value, tab)
              }`
            : 'No saved activity in this period'}
        </span>
        <strong>Daily average {averageValue(average, tab)}</strong>
      </footer>
    </section>
  );
}
