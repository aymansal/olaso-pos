import { categories } from '../../data/categories';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import styles from './CategoryRow.module.css';

export function CategoryRow() {
  return (
    <nav className={styles.row} aria-label="Product categories">
      {categories.map((category) => (
        <CategoryCard key={category.name} {...category} />
      ))}
    </nav>
  );
}
