import {
  Calculator,
  Coffee,
  Lightning,
  Pulse,
  Receipt,
  Star,
  TrendUp,
} from '@phosphor-icons/react';
import { hourlySales } from '../../data/dashboardData';
import styles from './SalesPulse.module.css';

const metrics = [
  { label: 'Orders', value: '126', icon: Receipt },
  { label: 'Average order', value: '67 MAD', icon: Calculator },
  { label: 'Items sold', value: '294', icon: Coffee },
] as const;

export function SalesPulse() {
  return (
    <section className={styles.panel} aria-labelledby="sales-pulse-title">
      <header className={styles.panelHeader}>
        <div className={styles.title}>
          <Pulse size={18} weight="regular" aria-hidden="true" />
          <h1 id="sales-pulse-title">Today’s pulse</h1>
        </div>
        <div className={styles.live}>
          <span />
          <strong>Live · 24 Jul</strong>
        </div>
      </header>

      <div className={styles.accent} />
      <p className={styles.netLabel}>NET SALES</p>
      <p className={styles.netValue}>8,460 MAD</p>
      <div className={styles.change}>
        <TrendUp size={14} weight="regular" aria-hidden="true" />
        <strong>12.4% vs yesterday</strong>
      </div>

      <div className={styles.summaryDividerTop} />
      <div className={styles.summary} aria-label="Today’s sales summary">
        {metrics.map(({ label, value, icon: Icon }, index) => (
          <div className={styles.metricSlot} key={label}>
            <div className={styles.metric}>
              <span className={styles.metricIcon}>
                <Icon size={17} weight="regular" aria-hidden="true" />
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
          <small>Orders by hour</small>
        </span>
        <span className={styles.peak}>
          <Lightning size={14} weight="regular" aria-hidden="true" />
          <strong>Peak 18:00 to 20:00</strong>
        </span>
      </div>

      <div className={styles.chart} aria-label="Orders by hour from 09:00 to 20:00">
        <div className={styles.guides} aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className={styles.bars} aria-hidden="true">
          {hourlySales.map(({ hour, height, tone }) => (
            <span className={styles.barColumn} key={hour}>
              <span
                className={`${styles.bar} ${styles[`tone${tone}`]}`}
                style={{ height }}
              />
            </span>
          ))}
        </div>
        <div className={styles.axis}>
          {hourlySales.map(({ hour }) => <span key={hour}>{hour}</span>)}
        </div>
      </div>

      <div className={styles.bestSellerDivider} />
      <div className={styles.bestSeller}>
        <div className={styles.bestProduct}>
          <span className={styles.bestIcon}>
            <Star size={18} weight="regular" aria-hidden="true" />
          </span>
          <span className={styles.bestCopy}>
            <small>TODAY’S BEST SELLER</small>
            <strong>Iced Pistachio Matcha</strong>
          </span>
        </div>
        <span className={styles.bestStats}>
          <strong>1,176 MAD</strong>
          <small>28 sold</small>
        </span>
      </div>
    </section>
  );
}
