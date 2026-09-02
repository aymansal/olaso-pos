import { useEffect, useState } from 'react';
import { TrendingUp } from '@boxicons/react';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import {
  calendarMonthEnd,
  calendarMonthOf,
  calendarMonthStart,
  inclusiveDayCount,
  localBusinessDate,
  shiftBusinessDate,
} from '../../../../lib/date';
import { formatMoney } from '../../../../lib/money';
import { useT } from '../../../../lib/locale';
import type { ReportTab } from '../../reportTypes';
import styles from './SalesTrendChart.module.css';

function metricValue(
  point: {
    netCentimes: number;
    itemCount: number;
    ingredientUsageEventCount: number;
  },
  tab: ReportTab,
) {
  if (tab === 'sales') return point.netCentimes;
  if (tab === 'products') return point.itemCount;
  return point.ingredientUsageEventCount;
}

function niceMaximum(value: number, ticks = 4, integer = false) {
  if (value <= 0) return ticks;
  const rough = Math.max(value / ticks, integer ? 1 : 0);
  const exp = 10 ** Math.floor(Math.log10(rough || 1));
  const n = rough / exp;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * exp;
  return step * ticks;
}

function axisLabel(value: number, tab: ReportTab) {
  if (tab === 'sales') return String(Math.round(value / 100));
  return String(Math.round(value));
}

function averageLabel(value: number, tab: ReportTab) {
  if (tab === 'sales') return formatMoney(Math.round(value));
  return new Intl.NumberFormat('en-MA', {
    maximumFractionDigits: 1,
  }).format(value);
}

export function SalesTrendChart({
  tab,
  snapshot,
  fillMonth = false,
}: {
  tab: ReportTab;
  snapshot?: ReportsSnapshot;
  fillMonth?: boolean;
}) {
  const t = useT();
  const today = localBusinessDate();
  const month = calendarMonthOf(today);
  const monthStart = calendarMonthStart(month);
  const monthEnd = calendarMonthEnd(month);
  const byDate = new Map(
    (snapshot?.daily ?? []).map((point) => [point.businessDate, point]),
  );
  const daily = fillMonth
    ? Array.from(
        { length: inclusiveDayCount(monthStart, monthEnd) },
        (_, index) => {
          const businessDate = shiftBusinessDate(monthStart, index);
          return byDate.get(businessDate) ?? {
            businessDate,
            netCentimes: 0,
            itemCount: 0,
            ingredientUsageEventCount: 0,
          };
        },
      )
    : snapshot?.daily ?? [];
  const elapsed = fillMonth
    ? inclusiveDayCount(monthStart, today < monthEnd ? today : monthEnd)
    : daily.length;
  const points = daily.map((day) => ({
    label: String(Number(day.businessDate.slice(8))),
    fromDate: day.businessDate,
    toDate: day.businessDate,
    value: metricValue(day, tab),
  }));
  const maximum = Math.max(...points.map((point) => point.value), 0);
  const scaleMaximum = niceMaximum(maximum, 4, tab !== 'sales');
  const peak = points.reduce(
    (highest, point) => point.value > highest.value ? point : highest,
    {
      label: '—',
      value: 0,
      fromDate: undefined as string | undefined,
      toDate: undefined as string | undefined,
    },
  );
  const average = elapsed
    ? daily.slice(0, elapsed).reduce(
        (total, point) => total + metricValue(point, tab),
        0,
      ) / elapsed
    : 0;
  const monthTitle = new Date(`${month}-01T12:00:00`).toLocaleDateString(
    'en-GB',
    { month: 'long', year: 'numeric' },
  );
  const title = tab === 'sales'
    ? t('Net sales trend')
    : tab === 'products'
      ? t('Units sold trend')
      : t('Recipe deductions');
  const subtitle = fillMonth ? monthTitle : t('Daily saved totals');
  const barHeight = 260;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    setSelectedKey(null);
  }, [tab]);

  const peakWhen = peak.fromDate !== peak.toDate
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
      });

  return (
    <section
      className={styles.chart}
      aria-labelledby="report-trend-title"
    >
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="report-trend-title">{title}</h2>
          <small>{subtitle}</small>
        </span>
        <span className={styles.legend}>
          <span><i className={styles.currentDot} />{t('This month')}</span>
        </span>
      </header>

      <div className={styles.guides} aria-hidden="true">
        {[1, 0.75, 0.5, 0.25].map((ratio) => (
          <span key={ratio}>
            <small>{axisLabel(scaleMaximum * ratio, tab)}</small><i />
          </span>
        ))}
      </div>

      <div
        className={styles.bars}
        aria-label={t('{title} by day', { title })}
      >
        {points.map((point) => {
          const isPeak = point.value > 0 && point === peak;
          const selected = selectedKey === point.toDate;
          const amount = tab === 'sales'
            ? formatMoney(point.value)
            : axisLabel(point.value, tab);
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
              className={`${styles.bar} ${isPeak ? styles.peakBar : ''} ${
                point.value ? '' : styles.emptyBar
              }`}
              style={{
                height: point.value
                  ? Math.max(
                      4,
                      Math.round((point.value / scaleMaximum) * barHeight),
                    )
                  : 0,
              }}
            >
              {selected ? <span className={styles.tip}>{amount}</span> : null}
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
            ? t('Peak {when} · {amount}', {
                when: peakWhen,
                amount: tab === 'sales'
                  ? formatMoney(peak.value)
                  : axisLabel(peak.value, tab),
              })
            : t('No saved activity in this period')}
        </span>
        <strong>{t('Daily average {value}', { value: averageLabel(average, tab) })}</strong>
      </footer>
    </section>
  );
}
