import { WaterDrop, Flask, Leaf, Package, ArrowRight } from '@boxicons/react';
import type { DashboardSnapshot } from '../../../../data/useDashboardData';
import { useT } from '../../../../lib/locale';
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
  onViewAll,
}: {
  warnings: DashboardSnapshot['warnings'];
  isLoading: boolean;
  error: string;
  onViewAll: () => void;
}) {
  const t = useT();
  return (
    <section className={styles.panel} aria-labelledby="stock-attention-title">
      <header className={styles.header}>
        <span>
          <h2 id="stock-attention-title">{t('Needs attention')}</h2>
          <small>{t('Ingredients below their threshold')}</small>
        </span>
        <button type="button" className={styles.viewAll} onClick={onViewAll}>
          <span>{t('View all')}</span>
          <ArrowRight width={13} height={13} aria-hidden="true" />
        </button>
      </header>

      <div className={styles.list}>
        {error || isLoading || warnings.length === 0 ? (
          <p className={styles.state} role={error ? 'alert' : 'status'}>
            {error
              ? t('Stock warnings are unavailable.')
              : isLoading
                ? t('Loading current stock…')
                : t('All active ingredients are above their thresholds.')}
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
                  {t('{qty} left', {
                    qty: formatStockQuantity(
                      warning.currentStockQuantity,
                      warning.baseUnit,
                    ),
                  })}
                </small>
              </span>
              <span className={`${styles.status} ${styles[presentation.tone]}`}>
                {t(presentation.status)}
              </span>
              {index < warnings.length - 1 ? <span className={styles.divider} /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
