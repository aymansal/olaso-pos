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
  if (products.length === 0) return null;
  return (
    <div className={styles.row} role="group" aria-label="Quick add best sellers">
      {products.map((product) => (
        <button
          key={product.id}
          className={styles.chip}
          type="button"
          aria-label={`Add ${product.name}`}
          onClick={() => onAdd(product.id)}
        >
          <strong>{product.name}</strong>
        </button>
      ))}
    </div>
  );
}
