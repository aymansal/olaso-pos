import { ArrowDown, Save, X } from '@boxicons/react';
import { useEffect, useState } from 'react';
import type {
  IngredientSaveInput,
  ManagedIngredient,
  ManagedIngredientDetail,
  StockAdjustmentMode,
} from '../../stockManagementTypes';
import {
  formatStockQuantity,
  ingredientLevel,
  movementLabel,
} from '../../stockPresentation';
import { useT } from '../../../../lib/locale';
import styles from './StockDetailPanel.module.css';

interface StockDetailPanelProps {
  ingredient?: ManagedIngredient;
  detail?: ManagedIngredientDetail;
  isLoading: boolean;
  onSave: (input: IngredientSaveInput) => Promise<void>;
  onDelete: (ingredient: ManagedIngredient) => Promise<void>;
  onAdjust: (
    ingredient: ManagedIngredient,
    mode: StockAdjustmentMode,
  ) => void;
  onReceivePurchase: (ingredient: ManagedIngredient) => void;
}

function movementTime(timestamp: number) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}

export function StockDetailPanel({
  ingredient,
  detail,
  isLoading,
  onSave,
  onDelete,
  onAdjust,
  onReceivePurchase,
}: StockDetailPanelProps) {
  const t = useT();
  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setName(ingredient?.name ?? '');
    setThreshold(
      ingredient?.lowStockThreshold ? String(ingredient.lowStockThreshold) : '',
    );
    setMessage('');
    setShowHistory(false);
  }, [ingredient?.id, ingredient?.revision]);

  if (!ingredient) {
    return (
      <aside className={styles.panel} aria-labelledby="stock-item-title">
        <div className={styles.empty}>
          <h2 id="stock-item-title">{t('Select an ingredient')}</h2>
          <p>{t('Choose a live stock record to review its balance and movements.')}</p>
        </div>
      </aside>
    );
  }

  const current = ingredient;
  const level = ingredientLevel(current);
  const difference =
    ingredient.currentStockQuantity - ingredient.lowStockThreshold;
  const recentMovements = detail?.movements.slice(0, 7) ?? [];
  const invalidThreshold =
    !Number.isSafeInteger(Number(threshold)) || Number(threshold) < 0;

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      await onSave({
        id: current.id,
        name,
        baseUnit: current.baseUnit,
        lowStockThreshold: Number(threshold),
        expectedRevision: current.revision,
      });
      setMessage('Changes saved.');
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className={styles.panel} aria-labelledby="stock-item-title">
      <header className={styles.header}>
        <h2 id="stock-item-title">{t('Ingredient')}</h2>
        <span className={styles.headerActions}>
          <strong className={`${styles.stockStatus} ${styles[level.toLowerCase()]}`}>
            <span aria-hidden="true" />
            {t(level)}
          </strong>
          <button
            type="button"
            className={styles.deleteAction}
            disabled={saving}
            onClick={async () => {
              if (!window.confirm(
                t('Delete {name}? Drinks using it will need updating.', {
                  name: ingredient.name,
                }),
              )) return;
              setSaving(true);
              setMessage('');
              try {
                await onDelete(ingredient);
              } catch (caught) {
                setMessage(caught instanceof Error
                  ? caught.message
                  : 'Ingredient could not be deleted.');
              } finally {
                setSaving(false);
              }
            }}
          >
            {t('Delete')}
          </button>
        </span>
      </header>

      <label className={`${styles.field} ${styles.nameField}`}>
        <span>{t('Ingredient name')}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className={`${styles.field} ${styles.thresholdField}`}>
        <span>{t('Low-stock threshold')}</span>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={threshold}
          onChange={(event) => setThreshold(event.target.value)}
        />
      </label>

      <span className={`${styles.divider} ${styles.infoDivider}`} aria-hidden="true" />

      <section className={styles.levelSection} aria-labelledby="stock-level-title">
        <header className={styles.levelHeader}>
          <h3 id="stock-level-title">{t('Stock level')}</h3>
          <small>{t('Exact saved balance')}</small>
        </header>
        <div className={styles.levelStrip}>
          {[
            {
              label: t('ON HAND'),
              value: formatStockQuantity(
                ingredient.currentStockQuantity,
                ingredient.baseUnit,
              ),
              tone: level === 'Low' ? 'low' : 'default',
            },
            {
              label: t('MINIMUM'),
              value: formatStockQuantity(
                ingredient.lowStockThreshold,
                ingredient.baseUnit,
              ),
              tone: 'default',
            },
            {
              label: t('DIFFERENCE'),
              value: formatStockQuantity(difference, ingredient.baseUnit),
              tone: difference >= 0 ? 'green' : 'low',
            },
          ].map(({ label, value, tone }, index) => (
            <span className={styles.level} key={label}>
              {index > 0 ? <span className={styles.levelDivider} aria-hidden="true" /> : null}
              <small>{label}</small>
              <strong className={styles[tone]}>{value}</strong>
            </span>
          ))}
        </div>
      </section>

      <section className={styles.movements} aria-labelledby="recent-movements-title">
        <header className={styles.sectionHeader}>
          <h3 id="recent-movements-title">{t('Recent movements')}</h3>
          <button
            type="button"
            disabled={!detail?.movements.length}
            onClick={() => setShowHistory(true)}
          >
            {t('View all')}
          </button>
        </header>
        <div className={styles.movementList}>
          {isLoading ? <p className={styles.state}>{t('Loading movements…')}</p> : null}
          {!isLoading && recentMovements.length === 0 ? (
            <p className={styles.state}>{t('No movements recorded.')}</p>
          ) : null}
          {recentMovements.map((movement) => (
            <article className={styles.movement} key={movement.id}>
              <span>
                <strong>{t(movementLabel(movement.movementType))}</strong>
                <small>{movementTime(movement.createdAt)}</small>
              </span>
              <strong
                className={
                  movement.quantityDelta < 0 ? styles.low : styles.green
                }
              >
                {formatStockQuantity(
                  movement.quantityDelta,
                  ingredient.baseUnit,
                )}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.actions}>
        <button
          className={styles.adjust}
          type="button"
          onClick={() => onAdjust(ingredient, 'set-count')}
        >
          {t('Adjust count')}
        </button>
        <button
          className={styles.receive}
          type="button"
          onClick={() => onReceivePurchase(ingredient)}
        >
          <ArrowDown width={15} height={15} aria-hidden="true" />
          {t('Receive')}
        </button>
      </footer>

      {message ? <p className={styles.notice}>{t(message)}</p> : null}
      <button
        type="button"
        className={styles.save}
        onClick={save}
        disabled={saving || !name.trim() || invalidThreshold}
      >
        <Save width={16} height={16} aria-hidden="true" />
        <span>{saving ? t('Saving…') : t('Save changes')}</span>
      </button>

      {showHistory && detail ? (
        <section
          className={styles.historyOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="movement-history-title"
        >
          <header>
            <span>
              <small>{t('APPEND-ONLY RECORD')}</small>
              <h3 id="movement-history-title">{t('Movement history')}</h3>
            </span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              aria-label={t('Close movement history')}
            >
              <X width={17} height={17} aria-hidden="true" />
            </button>
          </header>
          <div className={styles.historyRows}>
            {detail.movements.map((movement) => (
              <article key={movement.id}>
                <span>
                  <strong>{t(movementLabel(movement.movementType))}</strong>
                  <small>
                    {movement.reason} · {movement.actorLabel ?? t('Unknown actor')} ·{' '}
                    {movementTime(movement.createdAt)}
                  </small>
                </span>
                <strong
                  className={
                    movement.quantityDelta < 0 ? styles.low : styles.green
                  }
                >
                  {formatStockQuantity(
                    movement.quantityDelta,
                    ingredient.baseUnit,
                  )}
                </strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
