import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { stockItems } from '../../data/stockData';
import { StockIcon } from '../StockIcon/StockIcon';
import styles from './StockTable.module.css';

const columns = ['INGREDIENT', 'GROUP', 'ON HAND', 'MINIMUM', 'USED 24H', 'STATUS'];

export function StockTable() {
  return (
    <section className={styles.table} aria-labelledby="inventory-table-title">
      <header className={styles.header}>
        <h2 id="inventory-table-title">Inventory</h2>
        <small>Updated automatically after every sale</small>
      </header>

      <div className={styles.columns} aria-hidden="true">
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>

      <div className={styles.rows}>
        {stockItems.map((item) => (
          <article className={`${styles.row} ${item.selected ? styles.selected : ''}`} key={item.name}>
            <span className={styles.ingredient}>
              <span className={`${styles.icon} ${item.selected ? styles.selectedIcon : ''}`}>
                <StockIcon name={item.icon} size={15} />
              </span>
              <span className={styles.ingredientCopy}>
                <strong>{item.name}</strong>
                <small>{item.unit}</small>
              </span>
            </span>
            <span className={styles.cell}>{item.group}</span>
            <strong className={`${styles.cell} ${item.status === 'Low' ? styles.lowValue : ''}`}>{item.onHand}</strong>
            <span className={styles.cell}>{item.minimum}</span>
            <span className={styles.cell}>{item.used}</span>
            <span className={styles.statusCell}>
              <strong className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                <span aria-hidden="true" />
                {item.status}
              </strong>
            </span>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>Showing 5 of 42 stock items</span>
        <span className={styles.pagination}>
          <CaretLeft size={12} aria-hidden="true" />
          <strong>1 / 9</strong>
          <CaretRight size={12} aria-hidden="true" />
        </span>
      </footer>
    </section>
  );
}
