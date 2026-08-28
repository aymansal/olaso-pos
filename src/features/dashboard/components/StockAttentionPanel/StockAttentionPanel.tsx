import { WaterDrop, Flask, Leaf, Package, AlertTriangle } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { formatStockQuantity } from '../../../../lib/stock';
import styles from './StockAttentionPanel.module.css';

const icons = {
  drop: WaterDrop,
  flask: Flask,
  leaf: Leaf,
  package: Package,
};

function warningPresentation(
  warning: DashboardSnapshot['warnings'][number],
) {
  const icon = warning.key.includes('matcha')
    || warning.key.includes('tea')
    || warning.key.includes('hojicha')
    ? 'leaf'
    : warning.key.includes('syrup')
      ? 'flask'
      : warning.baseUnit === 'millilitre'
        ? 'drop'
        : 'package';
  if (warning.currentStockQuantity <= 0) {
    return { icon, status: 'Out', tone: 'danger' } as const;
  }
  return warning.currentStockQuantity * 2 <= warning.lowStockThreshold
    ? { icon, status: 'Critical', tone: 'danger' } as const
    : { icon, status: 'Low', tone: 'gold' } as const;
}

export function StockAttentionPanel({
  warnings,
  isLoading,
  error,
}: {
  warnings: DashboardSnapshot['warnings'];
  isLoading: boolean;
  error: string;
}) {
  return (
    <section className={styles.panel} aria-labelledby="stock-attention-title">
      <header className={styles.header}>
        <span>
          <h2 id="stock-attention-title">Needs attention</h2>
          <small>Ingredients below their threshold</small>
        </span>
        <span className={styles.warning}>
          <AlertTriangle width={14} height={14} aria-hidden="true" />
          <strong>
            {isLoading ? 'Loading' : error ? 'Unavailable' : `${warnings.length} items`}
          </strong>
        </span>
      </header>

      <div className={styles.list}>
        {error || isLoading || warnings.length === 0 ? (
          <p className={styles.state} role={error ? 'alert' : 'status'}>
            {error
              ? 'Stock warnings are unavailable.'
              : isLoading
                ? 'Loading current stock…'
                : 'All active ingredients are above their thresholds.'}
          </p>
        ) : warnings.map((warning, index) => {
          const presentation = warningPresentation(warning);
          const Icon = icons[presentation.icon];

          return (
            <article className={styles.row} key={warning.id}>
              <span className={`${styles.icon} ${styles[presentation.tone]}`}>
                <Icon width={16} height={16} aria-hidden="true" />
              </span>
              <span className={styles.copy}>
                <strong>{warning.name}</strong>
                <small>
                  {formatStockQuantity(
                    warning.currentStockQuantity,
                    warning.baseUnit,
                  )} left
                </small>
              </span>
              <span className={`${styles.status} ${styles[presentation.tone]}`}>
                {presentation.status}
              </span>
              {index < warnings.length - 1 ? <span className={styles.divider} /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
