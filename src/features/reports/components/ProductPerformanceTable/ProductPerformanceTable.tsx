import type { ReportsSnapshot } from '../../../../data/useReportsData';
import { formatMoney } from '../../../../lib/money';
import { formatStockQuantity } from '../../../../lib/stock';
import type { ReportTab } from '../../reportTypes';
import styles from './ProductPerformanceTable.module.css';

const productColumns = [
  'PRODUCT',
  'CATEGORY',
  'QTY SOLD',
  'NET SALES',
  'SHARE',
];
const stockColumns = [
  'INGREDIENT',
  'BASE UNIT',
  'CONSUMED',
  'PERIOD',
  'SOURCE',
];
const unitLabels = {
  millilitre: 'Millilitre',
  gram: 'Gram',
  milligram: 'Milligram',
  piece: 'Piece',
} as const;

export function ProductPerformanceTable({
  tab,
  snapshot,
}: {
  tab: ReportTab;
  snapshot?: ReportsSnapshot;
}) {
  const stock = tab === 'stock';
  const heading = stock
    ? 'Ingredient usage'
    : tab === 'products'
      ? 'Product performance'
      : 'Top products';
  const products = snapshot?.current.productTotals.slice(0, 3) ?? [];
  const ingredients = snapshot?.current.ingredientTotals.slice(0, 3) ?? [];

  return (
    <section className={styles.table} aria-labelledby="report-detail-title">
      <header className={styles.header}>
        <h2 id="report-detail-title">{heading}</h2>
        <small>Saved daily summaries</small>
      </header>
      <div className={styles.columns} aria-hidden="true">
        {(stock ? stockColumns : productColumns).map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div className={styles.rows}>
        {stock
          ? ingredients.map((ingredient, index) => (
              <article
                className={`${styles.row} ${
                  index === 0 ? styles.selected : ''
                }`}
                key={ingredient.ingredientId}
              >
                <strong>{ingredient.ingredientName}</strong>
                <span>{unitLabels[ingredient.baseUnit]}</span>
                <span>
                  {formatStockQuantity(
                    ingredient.quantity,
                    ingredient.baseUnit,
                  )}
                </span>
                <strong>{snapshot?.range.days ?? 0} days</strong>
                <strong className={styles.share}>Saved recipes</strong>
              </article>
            ))
          : products.map((product, index) => (
              <article
                className={`${styles.row} ${
                  index === 0 ? styles.selected : ''
                }`}
                key={product.productId}
              >
                <strong>{product.productName}</strong>
                <span>{product.categoryName ?? 'Category unavailable'}</span>
                <span>{product.quantity}</span>
                <strong>{formatMoney(product.totalCentimes)}</strong>
                <strong className={styles.share}>
                  {snapshot?.current.netCentimes
                    ? `${(
                        product.totalCentimes
                        / snapshot.current.netCentimes
                        * 100
                      ).toFixed(1)}%`
                    : '0%'}
                </strong>
              </article>
            ))}
        {(stock ? ingredients : products).length === 0 ? (
          <p className={styles.empty}>No saved detail for this period.</p>
        ) : null}
      </div>
    </section>
  );
}
