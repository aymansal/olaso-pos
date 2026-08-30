import { Coffee, Leaf, Package, Plus, Snowflake, Grid } from '@boxicons/react';
import type { CSSProperties } from 'react';
import type { ManagedCategory } from '../../productManagementTypes';
import styles from './CategorySidebar.module.css';

const UNCATEGORIZED_ID = 'uncategorized';

interface CategorySidebarProps {
  categories: ManagedCategory[];
  selectedCategoryId: string;
  totalProducts: number;
  uncategorizedCount: number;
  onSelect: (categoryId: string) => void;
  onAdd: () => void;
}

function iconForCategory(key: string) {
  if (key === UNCATEGORIZED_ID) return Package;
  if (key.includes('coffee')) return Coffee;
  if (key.includes('matcha') || key.includes('tea')) return Leaf;
  if (key.includes('cold') || key.includes('sweet')) return Snowflake;
  if (key.includes('bakery') || key.includes('savoury')) return Package;
  return Grid;
}

function categoryButton(
  category: {
    id: string;
    key: string;
    name: string;
    count: number;
    status: 'active' | 'archived';
  },
  selectedCategoryId: string,
  onSelect: (categoryId: string) => void,
  className?: string,
) {
  const Icon = iconForCategory(category.key);
  const active = category.id === selectedCategoryId;

  return (
    <button
      type="button"
      className={`${active ? styles.categoryActive : styles.category}${className ? ` ${className}` : ''}`}
      aria-pressed={active}
      onClick={() => onSelect(category.id)}
      key={category.id}
    >
      <Icon width={15} height={15} aria-hidden="true" />
      <span>
        <strong>{category.name}</strong>
        <small>
          {category.count} product{category.count === 1 ? '' : 's'}
          {category.status === 'archived' ? ' · Archived' : ''}
        </small>
      </span>
    </button>
  );
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  totalProducts,
  uncategorizedCount,
  onSelect,
  onAdd,
}: CategorySidebarProps) {
  const rows = [
    {
      id: 'all',
      key: 'all',
      name: 'All products',
      count: totalProducts,
      status: 'active' as const,
    },
    ...categories.map((category) => ({
      id: category.id,
      key: category.key,
      name: category.name,
      count: category.productCount,
      status: category.status,
    })),
  ];
  const listIndex = rows.findIndex((category) => category.id === selectedCategoryId);
  const index = listIndex < 0 ? -1 : listIndex;

  return (
    <aside className={styles.sidebar} aria-label="Product categories">
      <h2>Categories</h2>
      <p>{categories.filter((category) => category.status === 'active').length} menu groups</p>
      <div className={styles.categories} style={{ '--index': index } as CSSProperties}>
        {index >= 0 ? <span className={styles.indicator} aria-hidden="true" /> : null}
        {rows.map((category) => categoryButton(category, selectedCategoryId, onSelect))}
      </div>
      {categoryButton(
        {
          id: UNCATEGORIZED_ID,
          key: UNCATEGORIZED_ID,
          name: 'Uncategorized',
          count: uncategorizedCount,
          status: 'active',
        },
        selectedCategoryId,
        onSelect,
        `${styles.uncategorized}${
          selectedCategoryId === UNCATEGORIZED_ID
            ? ` ${styles.uncategorizedActive}`
            : ''
        }`,
      )}
      <button type="button" className={styles.addCategory} onClick={onAdd}>
        <Plus width={13} height={13} aria-hidden="true" />
        <span>Add category</span>
      </button>
    </aside>
  );
}
