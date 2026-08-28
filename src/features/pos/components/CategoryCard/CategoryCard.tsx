import { Card } from '@astryxdesign/core/Card';
import type { Category } from '../../data/categories';
import styles from './CategoryCard.module.css';

type CategoryCardProps = Category & {
  selected: boolean;
  onSelect: () => void;
};

export function CategoryCard({
  name,
  count,
  status,
  variant,
  image,
  selected,
  onSelect,
}: CategoryCardProps) {
  return (
    <button
      className={styles.button}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <Card
        className={`${styles.card} ${styles[variant]} ${selected ? styles.active : ''}`}
        width={234}
        height={120}
        padding={0}
      >
        <span className={styles.fill} aria-hidden="true" />
        <span className={styles.status}>{status}</span>
        <strong className={styles.name}>{name}</strong>
        <span className={styles.count}>{count} items</span>
        <img
          className={styles.illustration}
          src={image}
          alt=""
          width={126}
          height={108}
          decoding="async"
        />
      </Card>
    </button>
  );
}
