import { topProducts } from '../../data/reportsData';
import styles from './ProductPerformanceTable.module.css';

const columns = ['PRODUCT', 'CATEGORY', 'QTY SOLD', 'NET SALES', 'SHARE'];

export function ProductPerformanceTable() {
  return (
    <section className={styles.table} aria-labelledby="top-products-title">
      <header className={styles.header}>
        <h2 id="top-products-title">Top products</h2>
        <button type="button">View full product report</button>
      </header>
      <div className={styles.columns} aria-hidden="true">
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>
      <div className={styles.rows}>
        {topProducts.map((product) => (
          <article className={`${styles.row} ${product.selected ? styles.selected : ''}`} key={product.name}>
            <strong>{product.name}</strong>
            <span>{product.category}</span>
            <span>{product.quantity}</span>
            <strong>{product.sales}</strong>
            <strong className={styles.share}>{product.share}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
