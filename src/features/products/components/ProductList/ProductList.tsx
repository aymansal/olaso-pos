import { ChevronLeft, ChevronRight, Coffee, DotsHorizontalRounded, Leaf, Link, Unlink } from '@boxicons/react';
import type { CSSProperties } from 'react';
import type {
  ManagedCategory,
  ManagedProduct,
} from '../../productManagementTypes';
import { visiblePageIndexes } from '../../../../lib/pagination';
import styles from './ProductList.module.css';

interface ProductListProps {
  category?: ManagedCategory;
  categoryName: string;
  products: ManagedProduct[];
  selectedProductId?: string;
  isLoading: boolean;
  error?: string;
  page: number;
  pageCount: number;
  totalItems: number;
  onSelect: (productId: string) => void;
  onPageChange: (page: number) => void;
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
  page,
  pageCount,
  totalItems,
  onSelect,
  onPageChange,
  onRenameCategory,
  onSetCategoryArchived,
  onDeleteCategory,
}: ProductListProps) {
  const selectedIndex = products.findIndex(
    (product) => product.id === selectedProductId,
  );

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
              <DotsHorizontalRounded width={15} height={15} aria-hidden="true" />
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

      <div
        className={styles.rows}
        style={{ '--index': Math.max(0, selectedIndex) } as CSSProperties}
      >
        {isLoading ? <p className={styles.state}>Loading live menu…</p> : null}
        {error ? <p className={styles.state}>{error}</p> : null}
        {!isLoading && !error && products.length === 0 ? (
          <p className={styles.state}>No products match these filters.</p>
        ) : null}
        {!isLoading && !error && selectedIndex >= 0 ? (
          <span className={styles.indicator} aria-hidden="true" />
        ) : null}
        {!isLoading && !error
          ? products.map((product) => {
              const selected = product.id === selectedProductId;
              const Icon = product.key.includes('matcha') ? Leaf : Coffee;
              const RecipeIcon = product.currentRecipeVersionId
                ? Link
                : Unlink;
              return (
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => onSelect(product.id)}
                  aria-pressed={selected}
                  key={product.id}
                >
                  <span className={styles.product}>
                    <span
                      className={`${styles.productIcon} ${selected ? styles.productIconActive : ''}`}
                    >
                      {product.imageJpeg ? (
                        <img src={product.imageJpeg} alt="" />
                      ) : (
                        <Icon width={17} height={17} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.productCopy}>
                      <strong>{product.name}</strong>
                    </span>
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
                      width={11}
                      height={11}
                      aria-hidden="true"
                    />
                    <strong>
                      {product.currentRecipeVersionId ? 'Linked' : 'Not linked'}
                    </strong>
                  </span>
                </button>
              );
            })
          : null}
      </div>

      <footer className={styles.footer}>
        <span>
          Showing {products.length} of {totalItems} live record
          {totalItems === 1 ? '' : 's'}
        </span>
        <nav className={styles.pagination} aria-label="Products pagination">
          <button
            type="button"
            aria-label="Previous product page"
            disabled={isLoading || page <= 0}
            onClick={() => onPageChange(page - 1)}
            key="prev"
          >
            <ChevronLeft width={14} height={14} aria-hidden="true" />
          </button>
          {isLoading
            ? null
            : visiblePageIndexes(page, pageCount).map((index) => (
            <button
              type="button"
              className={index === page ? styles.current : undefined}
              aria-current={index === page ? 'page' : undefined}
              aria-label={`Page ${index + 1}`}
              onClick={() => onPageChange(index)}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next product page"
            disabled={isLoading || page >= pageCount - 1}
            onClick={() => onPageChange(page + 1)}
            key="next"
          >
            <ChevronRight width={14} height={14} aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
