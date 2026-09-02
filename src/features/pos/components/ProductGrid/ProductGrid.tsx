import type { Product } from '../../data/products';
import { useT } from '../../../../lib/locale';
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
  const t = useT();
  return (
    <section className={styles.grid} aria-label={t('Products')}>
      {products.length > 0
        ? products.map((product) =>
            <ProductCard
              key={product.id}
              {...product}
              onAdd={() => onAdd(product.id)}
            />)
        : <p className={styles.empty} role="status">{t(emptyMessage)}</p>}
    </section>
  );
}
