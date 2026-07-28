import { categories } from '../../data/categories';
import type { CategoryId } from '../../data/categories';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import styles from './CategoryRow.module.css';

type CategoryRowProps = {
  selectedCategoryId: CategoryId;
  onSelect: (categoryId: CategoryId) => void;
};

export function CategoryRow({ selectedCategoryId, onSelect }: CategoryRowProps) {
  return (
    <nav className={styles.row} aria-label="Product categories">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          {...category}
          selected={category.id === selectedCategoryId}
          onSelect={() => onSelect(category.id)}
        />
      ))}
    </nav>
  );
}
