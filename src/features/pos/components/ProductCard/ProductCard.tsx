import { Card } from '@astryxdesign/core/Card';
import { Plus } from '@phosphor-icons/react';
import type { Product } from '../../data/products';
import styles from './ProductCard.module.css';

export function ProductCard({ name, price, image }: Product) {
  return (
    <Card className={styles.card} width={174} height={162} padding={0}>
      <img className={styles.photo} src={image} alt="" />
      <strong className={styles.name}>{name}</strong>
      <span className={styles.price}>{price}</span>
      <button className={styles.add} type="button" aria-label={`Add ${name}`}>
        <Plus size={20} weight="regular" />
      </button>
    </Card>
  );
}
