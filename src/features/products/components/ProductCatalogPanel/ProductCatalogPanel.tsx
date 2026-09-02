import { Search, Plus, X } from '@boxicons/react';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { useT } from '../../../../lib/locale';
import type {
  ManagedCategory,
  ManagedProduct,
} from '../../productManagementTypes';
import { CategorySidebar } from '../CategorySidebar/CategorySidebar';
import { ProductList } from '../ProductList/ProductList';
import styles from './ProductCatalogPanel.module.css';

type AvailabilityFilter = 'all' | 'active' | 'unavailable';
type ProductSort = 'updated' | 'name' | 'price';

const UNCATEGORIZED_ID = 'uncategorized';

const AVAILABILITY_OPTIONS: { id: AvailabilityFilter; label: string }[] = [
  { id: 'all', label: 'All availability' },
  { id: 'active', label: 'Available' },
  { id: 'unavailable', label: 'Unavailable' },
];

const SORT_OPTIONS: { id: ProductSort; label: string }[] = [
  { id: 'updated', label: 'Recently updated' },
  { id: 'name', label: 'Product name' },
  { id: 'price', label: 'Price' },
];

interface ProductCatalogPanelProps {
  categories: ManagedCategory[];
  uncategorizedCount: number;
  totalProducts: number;
  products: ManagedProduct[];
  selectedCategoryId: string;
  selectedProductId?: string;
  search: string;
  availability: AvailabilityFilter;
  sort: ProductSort;
  isLoading: boolean;
  error?: string;
  onSearchChange: (value: string) => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onSortChange: (value: ProductSort) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (productId: string) => void;
  onAddCategory: () => void;
  onRenameCategory: () => void;
  onDeleteCategory: () => void;
  onAddProduct: () => void;
  page: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function ProductCatalogPanel({
  categories,
  uncategorizedCount,
  totalProducts,
  products,
  selectedCategoryId,
  selectedProductId,
  search,
  availability,
  sort,
  isLoading,
  error,
  onSearchChange,
  onAvailabilityChange,
  onSortChange,
  onSelectCategory,
  onSelectProduct,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onAddProduct,
  page,
  pageCount,
  totalItems,
  onPageChange,
}: ProductCatalogPanelProps) {
  const t = useT();
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  return (
    <section className={styles.panel} aria-labelledby="products-title">
      <header className={styles.header}>
        <h1 className={styles.heading} id="products-title">
          {t('Products')}
        </h1>
        <label className={styles.search}>
          <Search width={14} height={14} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('Search products')}
            placeholder={t('Search product')}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search !== '' ? (
            <button
              type="button"
              className={styles.clear}
              aria-label={t('Clear search')}
              onClick={() => onSearchChange('')}
            >
              <X width={12} height={12} aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <div className={styles.filter}>
          <MenuSelect
            ariaLabel="Filter availability"
            options={AVAILABILITY_OPTIONS}
            value={availability}
            onChange={(id) => onAvailabilityChange(id as AvailabilityFilter)}
          />
        </div>
        <div className={styles.sort}>
          <MenuSelect
            ariaLabel="Sort products"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(id) => onSortChange(id as ProductSort)}
          />
        </div>
        <button
          type="button"
          className={styles.addProduct}
          onClick={onAddProduct}
        >
          <Plus width={15} height={15} aria-hidden="true" />
          <span>{t('Add product')}</span>
        </button>
      </header>

      <CategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        totalProducts={totalProducts}
        uncategorizedCount={uncategorizedCount}
        onSelect={onSelectCategory}
        onAdd={onAddCategory}
      />
      <ProductList
        category={selectedCategory}
        categoryName={
          selectedCategoryId === UNCATEGORIZED_ID
            ? t('Uncategorized')
            : selectedCategory?.name ?? t('All products')
        }
        products={products}
        selectedProductId={selectedProductId}
        isLoading={isLoading}
        error={error}
        page={page}
        pageCount={pageCount}
        totalItems={totalItems}
        onSelect={onSelectProduct}
        onPageChange={onPageChange}
        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </section>
  );
}
