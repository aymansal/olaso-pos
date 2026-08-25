import {
  Coffee,
  DotsThree,
  Leaf,
  Link,
  LinkBreak,
} from '@phosphor-icons/react';
import type {
  ManagedCategory,
  ManagedProduct,
} from '../../productManagementTypes';
import styles from './ProductList.module.css';

interface ProductListProps {
  category?: ManagedCategory;
  categoryName: string;
  products: ManagedProduct[];
  selectedProductId?: string;
  isLoading: boolean;
  error?: string;
  onSelect: (productId: string) => void;
  onRenameCategory: () => void;
  onSetCategoryArchived: () => void;
  onDeleteCategory: () => void;
}

function formatMad(centimes: number) {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
  }).format(centimes / 100);
}

export function ProductList({
  category,
  categoryName,
  products,
  selectedProductId,
  isLoading,
  error,
  onSelect,
  onRenameCategory,
  onSetCategoryArchived,
  onDeleteCategory,
}: ProductListProps) {
  return (
    <section className={styles.list} aria-labelledby="category-products-title">
      <header className={styles.header}>
        <span>
          <h2 id="category-products-title">{categoryName}</h2>
          <small>
            {products.length} product{products.length === 1 ? '' : 's'}
          </small>
        </span>
        {category ? (
          <details className={styles.manage}>
            <summary aria-label={`Manage ${category.name}`}>
              <DotsThree size={15} weight="regular" aria-hidden="true" />
            </summary>
            <span>
              <button type="button" onClick={onRenameCategory}>
                Rename
              </button>
              <button type="button" onClick={onSetCategoryArchived}>
                {category.status === 'archived' ? 'Restore' : 'Archive'}
              </button>
              <button type="button" onClick={onDeleteCategory}>
                Delete
              </button>
            </span>
          </details>
        ) : null}
      </header>

      <div className={styles.columns} aria-hidden="true">
        <span>PRODUCT</span>
        <span>PRICE</span>
        <span>AVAILABILITY</span>
        <span>STOCK RECIPE</span>
      </div>

      <div className={styles.rows}>
        {isLoading ? <p className={styles.state}>Loading live menu…</p> : null}
        {error ? <p className={styles.state}>{error}</p> : null}
        {!isLoading && !error && products.length === 0 ? (
          <p className={styles.state}>No products match these filters.</p>
        ) : null}
        {!isLoading && !error
          ? products.map((product, index) => {
              const selected = product.id === selectedProductId;
              const Icon = product.key.includes('matcha') ? Leaf : Coffee;
              const RecipeIcon = product.currentRecipeVersionId
                ? Link
                : LinkBreak;
              return (
                <button
                  type="button"
                  className={`${styles.row} ${selected ? styles.selected : ''}`}
                  onClick={() => onSelect(product.id)}
                  aria-pressed={selected}
                  key={product.id}
                >
                  {selected ? <span className={styles.selectedMark} /> : null}
                  <span
                    className={`${styles.productIcon} ${selected ? styles.productIconActive : ''}`}
                  >
                    <Icon size={17} weight="regular" aria-hidden="true" />
                  </span>
                  <span className={styles.productCopy}>
                    <strong>{product.name}</strong>
                    <small>{product.key.toUpperCase()}</small>
                  </span>
                  <strong className={styles.price}>
                    {formatMad(product.basePriceCentimes)}
                  </strong>
                  <span
                    className={`${styles.available} ${styles[product.status]}`}
                  >
                    <span />
                    <strong>
                      {product.status === 'active'
                        ? 'Available'
                        : product.status === 'unavailable'
                          ? 'Unavailable'
                          : 'Archived'}
                    </strong>
                  </span>
                  <span
                    className={`${styles.recipe} ${product.currentRecipeVersionId ? styles.recipeLinked : ''}`}
                  >
                    <RecipeIcon
                      size={11}
                      weight="regular"
                      aria-hidden="true"
                    />
                    <strong>
                      {product.currentRecipeVersionId ? 'Linked' : 'Not linked'}
                    </strong>
                  </span>
                  {index < products.length - 1 ? (
                    <span className={styles.divider} />
                  ) : null}
                </button>
              );
            })
          : null}
      </div>

      <footer className={styles.footer}>
        <span>
          Showing {products.length} live record
          {products.length === 1 ? '' : 's'}
        </span>
        <strong>Synced with Convex</strong>
      </footer>
    </section>
  );
}
