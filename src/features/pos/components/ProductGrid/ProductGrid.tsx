import { products } from '../../data/products';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export function ProductGrid() {
  return (
    <section className={styles.grid} aria-label="Coffee products">
      {products.map((product) => (
        <ProductCard key={product.name} {...product} />
      ))}
    </section>
  );
}
