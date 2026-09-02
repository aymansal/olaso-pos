import type { Category, CategoryId } from '../../data/categories';
import { useT } from '../../../../lib/locale';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import styles from './CategoryRow.module.css';

type CategoryRowProps = {
  categories: Category[];
  selectedCategoryId: CategoryId;
  onSelect: (categoryId: CategoryId) => void;
};

export function CategoryRow({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryRowProps) {
  const t = useT();
  return (
    <nav className={styles.row} aria-label={t('Product categories')}>
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
