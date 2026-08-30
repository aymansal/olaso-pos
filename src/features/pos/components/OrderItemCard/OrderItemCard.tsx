import { Gift, Trash } from '@boxicons/react';
import { formatMoney } from '../../../../lib/money';
import type { Product } from '../../data/products';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import styles from './OrderItemCard.module.css';

type OrderItemCardProps = {
  product: Product;
  quantity: number;
  modifierSummary: string;
  complimentary: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
  onToggleOffert: () => void;
};

export function OrderItemCard({
  product,
  quantity,
  modifierSummary,
  complimentary,
  onDecrement,
  onIncrement,
  onRemove,
  onToggleOffert,
}: OrderItemCardProps) {
  const chargedCentimes = complimentary ? 0 : product.priceCentimes * quantity;
  const meta = [
    modifierSummary,
    complimentary ? 'Offert' : '',
    `${formatMoney(product.priceCentimes)} × ${quantity}`,
  ].filter(Boolean).join(' · ');

  return (
    <article className={`${styles.card}${complimentary ? ` ${styles.offertLine}` : ''}`}>
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
        {formatMoney(chargedCentimes)}
      </strong>
      <span className={styles.meta}>{meta}</span>
      <div className={styles.quantity}>
        <QuantityStepper
          productName={product.name}
          quantity={quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
      </div>
      <button
        className={`${styles.offert}${complimentary ? ` ${styles.offertOn}` : ''}`}
        type="button"
        aria-pressed={complimentary}
        aria-label={
          complimentary
            ? `Remove Offert from ${product.name}`
            : `Mark ${product.name} Offert`
        }
        onClick={onToggleOffert}
      >
        <Gift width={16} height={16} aria-hidden="true" />
      </button>
      <button
        className={styles.remove}
        type="button"
        aria-label={`Remove ${product.name}`}
        onClick={onRemove}
      >
        <Trash width={16} height={16} aria-hidden="true" />
      </button>
    </article>
  );
}
