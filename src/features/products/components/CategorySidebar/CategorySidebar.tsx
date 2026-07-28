import {
  Coffee,
  Leaf,
  Package,
  Plus,
  Snowflake,
  SquaresFour,
} from '@phosphor-icons/react';
import { productCategories } from '../../data/productsData';
import styles from './CategorySidebar.module.css';

const icons = {
  all: SquaresFour,
  coffee: Coffee,
  leaf: Leaf,
  package: Package,
  snowflake: Snowflake,
};

export function CategorySidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Product categories">
      <h2>Categories</h2>
      <p>Four menu groups</p>
      <div className={styles.categories}>
        {productCategories.map((category) => {
          const Icon = icons[category.icon];

          return (
            <button
              type="button"
              className={category.active ? styles.categoryActive : styles.category}
              aria-pressed={category.active ?? false}
              key={category.name}
            >
              <Icon size={15} weight="regular" aria-hidden="true" />
              <span>
                <strong>{category.name}</strong>
                <small>{category.count}</small>
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className={styles.addCategory}>
        <Plus size={13} weight="regular" aria-hidden="true" />
        <span>Add category</span>
      </button>
    </aside>
  );
}
