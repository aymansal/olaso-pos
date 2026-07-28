import {
  ArrowRight,
  Coffee,
  DotsThree,
  Leaf,
  LinkBreak,
} from '@phosphor-icons/react';
import { products } from '../../data/productsData';
import styles from './ProductList.module.css';

const icons = {
  coffee: Coffee,
  leaf: Leaf,
};

export function ProductList() {
  return (
    <section className={styles.list} aria-labelledby="category-products-title">
      <header className={styles.header}>
        <span>
          <h2 id="category-products-title">Matcha &amp; Hojicha</h2>
          <small>27 products</small>
        </span>
        <button type="button" aria-label="Manage category">
          <DotsThree size={15} weight="regular" aria-hidden="true" />
        </button>
      </header>

      <div className={styles.columns} aria-hidden="true">
        <span>PRODUCT</span>
        <span>PRICE</span>
        <span>AVAILABILITY</span>
        <span>STOCK RECIPE</span>
      </div>

      <div className={styles.rows}>
        {products.map((product, index) => {
          const Icon = icons[product.icon];

          return (
            <article className={`${styles.row} ${index === 0 ? styles.selected : ''}`} key={product.code}>
              {index === 0 ? <span className={styles.selectedMark} /> : null}
              <span className={`${styles.productIcon} ${index === 0 ? styles.productIconActive : ''}`}>
                <Icon size={17} weight="regular" aria-hidden="true" />
              </span>
              <span className={styles.productCopy}>
                <strong>{product.name}</strong>
                <small>{product.code}</small>
              </span>
              <strong className={styles.price}>{product.price}</strong>
              <span className={styles.available}>
                <span />
                <strong>Available</strong>
              </span>
              <span className={styles.recipe}>
                <LinkBreak size={11} weight="regular" aria-hidden="true" />
                <strong>Not linked</strong>
              </span>
              {index < products.length - 1 ? <span className={styles.divider} /> : null}
            </article>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <span>Showing 6 of 27 products</span>
        <button type="button">
          <span>View all</span>
          <ArrowRight size={11} weight="regular" aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}
