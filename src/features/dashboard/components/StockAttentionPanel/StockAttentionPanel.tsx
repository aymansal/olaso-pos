import {
  Drop,
  Flask,
  Leaf,
  Package,
  Warning,
} from '@phosphor-icons/react';
import { stockItems } from '../../data/dashboardData';
import styles from './StockAttentionPanel.module.css';

const icons = {
  drop: Drop,
  flask: Flask,
  leaf: Leaf,
  package: Package,
};

export function StockAttentionPanel() {
  return (
    <section className={styles.panel} aria-labelledby="stock-attention-title">
      <header className={styles.header}>
        <span>
          <h2 id="stock-attention-title">Needs attention</h2>
          <small>Ingredients below their threshold</small>
        </span>
        <span className={styles.warning}>
          <Warning size={14} weight="regular" aria-hidden="true" />
          <strong>4 items</strong>
        </span>
      </header>

      <div className={styles.list}>
        {stockItems.map((item, index) => {
          const Icon = icons[item.icon];

          return (
            <article className={styles.row} key={item.name}>
              <span className={`${styles.icon} ${styles[item.tone]}`}>
                <Icon size={16} weight="regular" aria-hidden="true" />
              </span>
              <span className={styles.copy}>
                <strong>{item.name}</strong>
                <small>{item.remaining}</small>
              </span>
              <span className={`${styles.status} ${styles[item.tone]}`}>
                {item.status}
              </span>
              {index < stockItems.length - 1 ? <span className={styles.divider} /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
