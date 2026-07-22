import { FileText } from '@phosphor-icons/react';
import { QuantityStepper } from '../QuantityStepper/QuantityStepper';
import styles from './OrderItemCard.module.css';

type OrderItemCardProps = {
  image: string;
};

export function OrderItemCard({ image }: OrderItemCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.photo} src={image} alt="" />
      <strong className={styles.name}>Americano</strong>
      <strong className={styles.total}>$16.8</strong>
      <span className={styles.meta}>$8.4 × 2 · Medium</span>
      <span className={styles.note}><FileText size={16} />Less Sugar</span>
      <div className={styles.quantity}><QuantityStepper /></div>
    </article>
  );
}
