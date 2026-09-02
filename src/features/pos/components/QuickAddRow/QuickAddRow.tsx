import { useT } from '../../../../lib/locale';
import styles from './QuickAddRow.module.css';

type QuickAddProduct = {
  id: string;
  name: string;
};

type QuickAddRowProps = {
  products: QuickAddProduct[];
  onAdd: (productId: string) => void;
};

export function QuickAddRow({ products, onAdd }: QuickAddRowProps) {
  const t = useT();
  if (products.length === 0) return null;
  return (
    <div className={styles.row} role="group" aria-label={t('Quick add best sellers')}>
      {products.map((product) => (
        <button
          key={product.id}
          className={styles.chip}
          type="button"
          aria-label={t('Add {name}', { name: product.name })}
          onClick={() => onAdd(product.id)}
        >
          <strong>{product.name}</strong>
        </button>
      ))}
    </div>
  );
}
