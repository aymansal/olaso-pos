import { TrendUp } from '@phosphor-icons/react';
import { salesBars } from '../../data/reportsData';
import styles from './SalesTrendChart.module.css';

export function SalesTrendChart() {
  return (
    <section className={styles.chart} aria-labelledby="sales-trend-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="sales-trend-title">Net sales trend</h2>
          <small>Daily sales · compared with 01–24 June</small>
        </span>
        <span className={styles.legend}>
          <span><i className={styles.currentDot} />July</span>
          <span><i className={styles.previousDot} />June avg</span>
        </span>
      </header>

      <div className={styles.guides} aria-hidden="true">
        {['8k', '6k', '4k', '2k'].map((label) => (
          <span key={label}><small>{label}</small><i /></span>
        ))}
      </div>

      <div className={styles.bars} aria-label="Daily sales from 01 to 23 July">
        {salesBars.map(({ day, height, peak }) => (
          <span className={styles.barGroup} key={day}>
            <i
              className={`${styles.bar} ${peak ? styles.peakBar : ''}`}
              style={{ height }}
            >
              {peak ? <span aria-hidden="true" /> : null}
            </i>
            <small className={peak ? styles.peakLabel : ''}>{day}</small>
          </span>
        ))}
      </div>

      <footer className={styles.footer}>
        <span><TrendUp size={12} aria-hidden="true" />Peak day: 21 July · 8,920 MAD</span>
        <strong>Daily average 5,496 MAD</strong>
      </footer>
    </section>
  );
}
