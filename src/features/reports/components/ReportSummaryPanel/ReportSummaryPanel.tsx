import {
  CalendarCheck,
  Coffee,
  Drop,
  FileCsv,
  FilePdf,
  Minus,
  Package,
  TrendDown,
  TrendUp,
} from '@phosphor-icons/react';
import type { ReportsSnapshot } from '../../../../data/useReportsData';
import { formatMoney } from '../../../../lib/money';
import { formatStockQuantity } from '../../../../lib/stock';
import styles from './ReportSummaryPanel.module.css';

const categoryTones = ['primary', 'coffee', 'cold', 'bakery'] as const;
const paymentTones = ['cash', 'card', 'online'] as const;

function dateLabel(from: string, to: string) {
  const fromDate = new Date(`${from}T12:00:00`);
  const toDate = new Date(`${to}T12:00:00`);
  return `${fromDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })} – ${toDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function ReportSummaryPanel({
  snapshot,
  isLoading,
  error,
}: {
  snapshot?: ReportsSnapshot;
  isLoading: boolean;
  error: string;
}) {
  const current = snapshot?.current;
  const previous = snapshot?.previous;
  const categories = current?.categoryTotals.slice(0, 4) ?? [];
  const payments = current?.paymentTotals.slice(0, 3) ?? [];
  const ingredientTotals = current?.ingredientTotals ?? [];
  const ingredients = ingredientTotals.slice(0, 3);
  const difference = previous?.netCentimes
    ? (
        ((current?.netCentimes ?? 0) - previous.netCentimes)
        / previous.netCentimes
      ) * 100
    : undefined;
  const ComparisonIcon = difference === undefined
    ? Minus
    : difference >= 0
      ? TrendUp
      : TrendDown;

  return (
    <aside className={styles.panel} aria-labelledby="report-summary-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="report-summary-title">Report summary</h2>
          <small>
            {snapshot
              ? dateLabel(snapshot.range.from, snapshot.range.to)
              : 'Selected report period'}
          </small>
        </span>
        <strong className={styles.period}>
          <CalendarCheck size={12} aria-hidden="true" />
          <span>{snapshot?.range.days ?? 0} days</span>
        </strong>
      </header>

      <section className={styles.salesSummary} aria-label="Report net sales">
        <span>
          <small>NET SALES</small>
          <strong>
            {isLoading
              ? 'Loading…'
              : error
                ? 'Unavailable'
                : formatMoney(current?.netCentimes ?? 0)}
          </strong>
        </span>
        <strong
          className={`${styles.comparison} ${
            difference !== undefined && difference < 0
              ? styles.negative
              : ''
          }`}
        >
          <ComparisonIcon size={12} aria-hidden="true" />
          <span>
            {difference === undefined
              ? 'No prior data'
              : `${difference >= 0 ? '+' : '−'}${Math.abs(
                  difference,
                ).toFixed(1)}% vs prior`}
          </span>
        </strong>
      </section>

      <span
        className={`${styles.divider} ${styles.salesDivider}`}
        aria-hidden="true"
      />

      <section
        className={styles.categorySection}
        aria-labelledby="sales-category-title"
      >
        <header className={styles.sectionHeader}>
          <h3 id="sales-category-title">Sales by category</h3>
          <small>{formatMoney(current?.netCentimes ?? 0)}</small>
        </header>
        <div className={styles.categories}>
          {categories.map((category, index) => {
            const share = current?.netCentimes
              ? category.totalCentimes / current.netCentimes * 100
              : 0;
            return (
              <article
                className={styles.category}
                key={category.categoryId}
              >
                <strong>{category.categoryName}</strong>
                <span>{formatMoney(category.totalCentimes)}</span>
                <strong>{share.toFixed(0)}%</strong>
                <i className={styles.track}>
                  <i
                    className={styles[categoryTones[index]]}
                    style={{ width: `${share}%` }}
                  />
                </i>
              </article>
            );
          })}
          {categories.length === 0 ? (
            <p className={styles.empty}>No saved category sales.</p>
          ) : null}
        </div>
      </section>

      <section
        className={styles.paymentSection}
        aria-labelledby="payment-methods-title"
      >
        <header className={styles.sectionHeader}>
          <h3 id="payment-methods-title">Payment methods</h3>
          <small>{current?.orderCount ?? 0} orders</small>
        </header>
        <div className={styles.paymentBar} aria-label="Payment method share">
          {payments.map((method, index) => (
            <i
              className={styles[paymentTones[index]]}
              style={{
                width: `${current?.netCentimes
                  ? method.totalCentimes / current.netCentimes * 100
                  : 0}%`,
              }}
              key={method.paymentMethod}
            />
          ))}
        </div>
        <div className={styles.paymentLegend}>
          {payments.map((method, index) => (
            <span key={method.paymentMethod}>
              <i className={styles[paymentTones[index]]} />
              {method.paymentMethod}{' '}
              {current?.netCentimes
                ? `${Math.round(
                    method.totalCentimes / current.netCentimes * 100,
                  )}%`
                : '0%'}
            </span>
          ))}
          {payments.length === 0 ? <span>No saved payments</span> : null}
        </div>
      </section>

      <span
        className={`${styles.divider} ${styles.paymentDivider}`}
        aria-hidden="true"
      />

      <section
        className={styles.stockSection}
        aria-labelledby="stock-consumed-title"
      >
        <header className={styles.stockHeader}>
          <h3 id="stock-consumed-title">Stock consumed</h3>
          <strong>{ingredientTotals.length} used</strong>
        </header>
        <div className={styles.stockList}>
          {ingredients.map((ingredient) => {
            const Icon = ingredient.baseUnit === 'millilitre'
              ? Drop
              : ingredient.baseUnit === 'piece'
                ? Package
                : Coffee;
            return (
              <article
                className={styles.stockItem}
                key={ingredient.ingredientId}
              >
                <span>
                  <i><Icon size={13} aria-hidden="true" /></i>
                  <strong>{ingredient.ingredientName}</strong>
                </span>
                <strong>
                  {formatStockQuantity(
                    ingredient.quantity,
                    ingredient.baseUnit,
                  )}
                </strong>
              </article>
            );
          })}
          {ingredients.length === 0 ? (
            <p className={styles.stockEmpty}>No saved recipe usage.</p>
          ) : null}
        </div>
      </section>

      <footer className={styles.actions}>
        <button
          className={styles.csv}
          type="button"
          disabled
          title="Export destination pending owner confirmation"
        >
          <FileCsv size={15} aria-hidden="true" />
          <span>Export CSV</span>
        </button>
        <button
          className={styles.pdf}
          type="button"
          disabled
          title="Export destination pending owner confirmation"
        >
          <FilePdf size={15} aria-hidden="true" />
          <span>Export PDF report</span>
        </button>
      </footer>
    </aside>
  );
}
