import type { Product } from '../../data/products';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
  onAdd: (productId: string) => void;
};

export function ProductGrid({
  products,
  emptyMessage = 'No products match this category and search.',
  onAdd,
}: ProductGridProps) {
  return (
    <section className={styles.grid} aria-label="Products">
      {products.length > 0
        ? products.map((product) =>
            <ProductCard
              key={product.id}
              {...product}
              onAdd={() => onAdd(product.id)}
            />)
        : <p className={styles.empty} role="status">{emptyMessage}</p>}
    </section>
  );
}
