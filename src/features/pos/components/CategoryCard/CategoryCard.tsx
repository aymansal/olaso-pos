import { Card } from '@astryxdesign/core/Card';
import type { Category } from '../../data/categories';
import styles from './CategoryCard.module.css';

export function CategoryCard({ name, count, status, variant, image }: Category) {
  return (
    <Card
      className={`${styles.card} ${styles[variant]}`}
      width={234}
      height={120}
      padding={0}
      aria-current={variant === 'active' ? 'page' : undefined}
    >
      <span className={styles.status}>{status}</span>
      <strong className={styles.name}>{name}</strong>
      <span className={styles.count}>{count}</span>
      <img className={styles.illustration} src={image} alt="" />
    </Card>
  );
}
