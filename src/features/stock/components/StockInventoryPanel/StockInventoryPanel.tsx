import {
  CaretDown,
  CurrencyCircleDollar,
  MagnifyingGlass,
  Plus,
  Stack,
  TrendDown,
  Warning,
} from '@phosphor-icons/react';
import { stockSummaries } from '../../data/stockData';
import { StockTable } from '../StockTable/StockTable';
import styles from './StockInventoryPanel.module.css';

const summaryIcons = {
  stack: Stack,
  warning: Warning,
  currency: CurrencyCircleDollar,
  trend: TrendDown,
} as const;

export function StockInventoryPanel() {
  return (
    <section className={styles.panel} aria-labelledby="stock-inventory-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="stock-inventory-title">Stock inventory</h1>
          <small>Ingredients and packaging measured in their real units</small>
        </span>
        <button className={styles.addIngredient} type="button">
          <Plus size={15} aria-hidden="true" />
          <span>Add ingredient</span>
        </button>
      </header>

      <div className={styles.summary} aria-label="Stock summary">
        {stockSummaries.map(({ icon, value, label, tone }, index) => {
          const Icon = summaryIcons[icon];

          return (
            <div className={styles.summaryEntry} key={label}>
              {index > 0 ? <span className={styles.summaryDivider} aria-hidden="true" /> : null}
              <span className={`${styles.summaryIcon} ${styles[tone]}`}>
                <Icon size={15} aria-hidden="true" />
              </span>
              <span className={styles.summaryCopy}>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <MagnifyingGlass size={15} aria-hidden="true" />
          <input type="search" aria-label="Search stock" placeholder="Search ingredients or packaging" />
        </label>
        <button className={styles.filter} type="button">
          <span>All groups</span>
          <CaretDown size={13} aria-hidden="true" />
        </button>
        <button className={styles.statusFilter} type="button">
          <span>All stock levels</span>
          <CaretDown size={13} aria-hidden="true" />
        </button>
      </div>

      <StockTable />
    </section>
  );
}
