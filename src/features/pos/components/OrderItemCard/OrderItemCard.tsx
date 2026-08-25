import { Trash } from '@phosphor-icons/react';
import { formatMoney } from '../../../../lib/money';
import type { Product } from '../../data/products';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import styles from './OrderItemCard.module.css';

type OrderItemCardProps = {
  product: Product;
  quantity: number;
  modifierSummary: string;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
};

export function OrderItemCard({
  product,
  quantity,
  modifierSummary,
  onDecrement,
  onIncrement,
  onRemove,
}: OrderItemCardProps) {
  return (
    <article className={styles.card}>
      <img
        className={styles.photo}
        src={product.image}
        alt={product.name}
        width={60}
        height={76}
        decoding="async"
      />
      <strong className={styles.name}>{product.name}</strong>
      <strong className={styles.total}>
        {formatMoney(product.priceCentimes * quantity)}
      </strong>
      <span className={styles.meta}>
        {modifierSummary ? `${modifierSummary} · ` : ''}
        {formatMoney(product.priceCentimes)} × {quantity}
      </span>
      <div className={styles.quantity}>
        <QuantityStepper
          productName={product.name}
          quantity={quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
      </div>
      <button
        className={styles.remove}
        type="button"
        aria-label={`Remove ${product.name}`}
        onClick={onRemove}
      >
        <Trash size={18} aria-hidden="true" />
      </button>
    </article>
  );
}
