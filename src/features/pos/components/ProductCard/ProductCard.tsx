import { Card } from '@astryxdesign/core/Card';
import { Plus } from '@boxicons/react';
import { formatMoney } from '../../../../lib/money';
import type { Product } from '../../data/products';
import styles from './ProductCard.module.css';

type ProductCardProps = Product & {
  onAdd: () => void;
};

export function ProductCard({ name, priceCentimes, image, onAdd }: ProductCardProps) {
  return (
    <Card className={styles.card} width={174} height={162} padding={0}>
      <img
        className={styles.photo}
        src={image}
        alt=""
        width={72}
        height={92}
        decoding="async"
      />
      <strong className={styles.name}>{name}</strong>
      <span className={styles.price}>{formatMoney(priceCentimes)}</span>
      <button
        className={styles.add}
        type="button"
        aria-label={`Add ${name}`}
        onClick={onAdd}
      >
        <Plus width={20} height={20} />
      </button>
    </Card>
  );
}
