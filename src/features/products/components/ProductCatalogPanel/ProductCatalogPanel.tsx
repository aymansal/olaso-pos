import {
  ArrowsDownUp,
  CaretDown,
  CheckCircle,
  MagnifyingGlass,
  Plus,
} from '@phosphor-icons/react';
import { CategorySidebar } from '../CategorySidebar/CategorySidebar';
import { ProductList } from '../ProductList/ProductList';
import styles from './ProductCatalogPanel.module.css';

export function ProductCatalogPanel() {
  return (
    <section className={styles.panel} aria-labelledby="products-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="products-title">Products</h1>
          <small>Manage the menu, pricing and availability</small>
        </span>
        <button type="button" className={styles.addProduct}>
          <Plus size={15} weight="regular" aria-hidden="true" />
          <span>Add product</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
          <input aria-label="Search products" placeholder="Search product" />
        </label>
        <button type="button" className={styles.filter}>
          <CheckCircle size={15} weight="regular" aria-hidden="true" />
          <span>All availability</span>
          <CaretDown size={13} weight="regular" aria-hidden="true" />
        </button>
        <button type="button" className={styles.sort}>
          <ArrowsDownUp size={15} weight="regular" aria-hidden="true" />
          <span>Recently updated</span>
          <CaretDown size={13} weight="regular" aria-hidden="true" />
        </button>
      </div>

      <CategorySidebar />
      <ProductList />
    </section>
  );
}
