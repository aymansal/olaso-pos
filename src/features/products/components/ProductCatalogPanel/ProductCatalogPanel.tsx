import {
  ArrowsDownUp,
  CheckCircle,
  MagnifyingGlass,
  Plus,
} from '@phosphor-icons/react';
import type {
  ManagedCategory,
  ManagedProduct,
} from '../../productManagementTypes';
import { CategorySidebar } from '../CategorySidebar/CategorySidebar';
import { ProductList } from '../ProductList/ProductList';
import styles from './ProductCatalogPanel.module.css';

type AvailabilityFilter = 'all' | ManagedProduct['status'];
type ProductSort = 'updated' | 'name' | 'price';

interface ProductCatalogPanelProps {
  categories: ManagedCategory[];
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
  onSetCategoryArchived: () => void;
  onDeleteCategory: () => void;
  onAddProduct: () => void;
}

export function ProductCatalogPanel({
  categories,
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
  onSetCategoryArchived,
  onDeleteCategory,
  onAddProduct,
}: ProductCatalogPanelProps) {
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  return (
    <section className={styles.panel} aria-labelledby="products-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="products-title">Products</h1>
          <small>Manage the menu, pricing and availability</small>
        </span>
        <button
          type="button"
          className={styles.addProduct}
          onClick={onAddProduct}
        >
          <Plus size={15} weight="regular" aria-hidden="true" />
          <span>Add product</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <MagnifyingGlass size={16} weight="regular" aria-hidden="true" />
          <input
            aria-label="Search products"
            placeholder="Search product"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className={styles.filter}>
          <CheckCircle size={15} weight="regular" aria-hidden="true" />
          <select
            aria-label="Filter availability"
            value={availability}
            onChange={(event) =>
              onAvailabilityChange(event.target.value as AvailabilityFilter)
            }
          >
            <option value="all">All availability</option>
            <option value="active">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className={styles.sort}>
          <ArrowsDownUp size={15} weight="regular" aria-hidden="true" />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as ProductSort)
            }
          >
            <option value="updated">Recently updated</option>
            <option value="name">Product name</option>
            <option value="price">Price</option>
          </select>
        </label>
      </div>

      <CategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        totalProducts={categories.reduce(
          (total, category) => total + category.productCount,
          0,
        )}
        onSelect={onSelectCategory}
        onAdd={onAddCategory}
      />
      <ProductList
        category={selectedCategory}
        categoryName={selectedCategory?.name ?? 'All products'}
        products={products}
        selectedProductId={selectedProductId}
        isLoading={isLoading}
        error={error}
        onSelect={onSelectProduct}
        onRenameCategory={onRenameCategory}
        onSetCategoryArchived={onSetCategoryArchived}
        onDeleteCategory={onDeleteCategory}
      />
    </section>
  );
}
