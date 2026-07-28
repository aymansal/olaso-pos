import {
  CalendarCheck,
  Coffee,
  Drop,
  FileCsv,
  FilePdf,
  Leaf,
  TrendUp,
  Warning,
} from '@phosphor-icons/react';
import {
  paymentMethods,
  salesCategories,
  stockConsumed,
} from '../../data/reportsData';
import styles from './ReportSummaryPanel.module.css';

const consumedIcons = {
  drop: Drop,
  coffee: Coffee,
  leaf: Leaf,
} as const;

export function ReportSummaryPanel() {
  return (
    <aside className={styles.panel} aria-labelledby="report-summary-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="report-summary-title">Report summary</h2>
          <small>01 July – 24 July 2026</small>
        </span>
        <strong className={styles.period}>
          <CalendarCheck size={12} aria-hidden="true" />
          <span>24 days</span>
        </strong>
      </header>

      <section className={styles.salesSummary} aria-label="Report net sales">
        <span>
          <small>NET SALES</small>
          <strong>126,420 MAD</strong>
        </span>
        <strong className={styles.comparison}>
          <TrendUp size={12} aria-hidden="true" />
          <span>11.8% vs June</span>
        </strong>
      </section>

      <span className={`${styles.divider} ${styles.salesDivider}`} aria-hidden="true" />

      <section className={styles.categorySection} aria-labelledby="sales-category-title">
        <header className={styles.sectionHeader}>
          <h3 id="sales-category-title">Sales by category</h3>
          <small>126,420 MAD</small>
        </header>
        <div className={styles.categories}>
          {salesCategories.map((category) => (
            <article className={styles.category} key={category.name}>
              <strong>{category.name}</strong>
              <span>{category.amount}</span>
              <strong>{category.share}</strong>
              <i className={styles.track}>
                <i
                  className={styles[category.tone]}
                  style={{ width: category.width }}
                />
              </i>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.paymentSection} aria-labelledby="payment-methods-title">
        <header className={styles.sectionHeader}>
          <h3 id="payment-methods-title">Payment methods</h3>
          <small>1,842 orders</small>
        </header>
        <div className={styles.paymentBar} aria-label="Cash 62%, card 26%, online 12%">
          <i className={styles.cash} />
          <i className={styles.card} />
          <i className={styles.online} />
        </div>
        <div className={styles.paymentLegend}>
          {paymentMethods.map((method) => (
            <span key={method.name}>
              <i className={styles[method.tone]} />
              {method.name} {method.share}
            </span>
          ))}
        </div>
      </section>

      <span className={`${styles.divider} ${styles.paymentDivider}`} aria-hidden="true" />

      <section className={styles.stockSection} aria-labelledby="stock-consumed-title">
        <header className={styles.stockHeader}>
          <h3 id="stock-consumed-title">Stock consumed</h3>
          <strong><Warning size={11} aria-hidden="true" />3 low items</strong>
        </header>
        <div className={styles.stockList}>
          {stockConsumed.map(({ icon, name, value }) => {
            const Icon = consumedIcons[icon];

            return (
              <article className={styles.stockItem} key={name}>
                <span>
                  <i><Icon size={13} aria-hidden="true" /></i>
                  <strong>{name}</strong>
                </span>
                <strong>{value}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <footer className={styles.actions}>
        <button className={styles.csv} type="button">
          <FileCsv size={15} aria-hidden="true" />
          <span>Export CSV</span>
        </button>
        <button className={styles.pdf} type="button">
          <FilePdf size={15} aria-hidden="true" />
          <span>Export PDF report</span>
        </button>
      </footer>
    </aside>
  );
}
