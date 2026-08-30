import { ArrowDown, Save, X } from '@boxicons/react';
import { useEffect, useState } from 'react';
import type {
  IngredientSaveInput,
  ManagedIngredient,
  ManagedIngredientDetail,
  StockAdjustmentMode,
} from '../../stockManagementTypes';
import {
  baseUnitLabel,
  formatStockQuantity,
  ingredientLevel,
  movementLabel,
} from '../../stockPresentation';
import { formatMoney } from '../../../../lib/money';
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
          <h2 id="stock-item-title">Select an ingredient</h2>
          <p>Choose a live stock record to review its balance and movements.</p>
        </div>
      </aside>
    );
  }

  const current = ingredient;
  const level = ingredientLevel(current);
  const difference =
    ingredient.currentStockQuantity - ingredient.lowStockThreshold;
  const recentMovements = detail?.movements.slice(0, 2) ?? [];
  const linkedRecipes = detail?.linkedRecipes.slice(0, 3) ?? [];
  const inventoryValue = ingredient.inventoryValueCentimes;
  const averageCost = inventoryValue === undefined || ingredient.currentStockQuantity === 0
    ? undefined : Math.round(inventoryValue / ingredient.currentStockQuantity);
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
        <span className={styles.heading}>
          <small>STOCK DETAILS</small>
          <h2 id="stock-item-title">Edit ingredient</h2>
        </span>
        <span className={styles.headerActions}>
          <strong className={`${styles.stockStatus} ${styles[level.toLowerCase()]}`}>
            <span aria-hidden="true" />
            {level}
          </strong>
          <button
            type="button"
            className={styles.deleteAction}
            disabled={saving}
            onClick={async () => {
              if (!window.confirm(
                `Delete ${ingredient.name}? Drinks using it will need updating.`,
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
            Delete
          </button>
        </span>
      </header>

      <div className={styles.identity}>
        <span className={styles.identityCopy}>
          <strong>{name || ingredient.name}</strong>
          <small>
            {ingredient.key.toUpperCase()} · {baseUnitLabel(ingredient.baseUnit)}
          </small>
        </span>
        <span className={styles.onHand}>
          <strong>
            {formatStockQuantity(
              ingredient.currentStockQuantity,
              ingredient.baseUnit,
            )}
          </strong>
          <small>On hand</small>
        </span>
      </div>

      <span className={`${styles.divider} ${styles.identityDivider}`} aria-hidden="true" />
      <h3 className={styles.infoTitle}>Ingredient information</h3>

      <label className={`${styles.field} ${styles.nameField}`}>
        <span>Ingredient name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className={`${styles.field} ${styles.thresholdField}`}>
        <span>Low-stock threshold</span>
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
          <h3 id="stock-level-title">Stock level</h3>
          <small>Exact saved balance</small>
        </header>
        <div className={styles.levelStrip}>
          {[
            {
              label: 'ON HAND',
              value: formatStockQuantity(
                ingredient.currentStockQuantity,
                ingredient.baseUnit,
              ),
              tone: level === 'Low' ? 'low' : 'default',
            },
            {
              label: 'MINIMUM',
              value: formatStockQuantity(
                ingredient.lowStockThreshold,
                ingredient.baseUnit,
              ),
              tone: 'default',
            },
            {
              label: 'DIFFERENCE',
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
        <p className={styles.costSummary}>
          {ingredient.costStatus === 'complete' && inventoryValue !== undefined
            ? `Inventory value ${formatMoney(inventoryValue)} · average ${formatMoney(averageCost ?? 0)} / ${formatStockQuantity(1, ingredient.baseUnit)}`
            : 'Cost incomplete — receive a priced package before claiming inventory value.'}
        </p>
      </section>

      <section className={styles.recipes} aria-labelledby="linked-recipes-title">
        <header className={styles.sectionHeader}>
          <h3 id="linked-recipes-title">Linked recipes</h3>
          <small>
            {detail?.linkedRecipes.length ?? 0} product
            {(detail?.linkedRecipes.length ?? 0) === 1 ? '' : 's'}
          </small>
        </header>
        <div className={styles.recipeList}>
          {isLoading ? <p className={styles.state}>Loading recipe links…</p> : null}
          {!isLoading && linkedRecipes.length === 0 ? (
            <p className={styles.state}>No active recipes use this ingredient.</p>
          ) : null}
          {linkedRecipes.map((recipe) => (
            <article className={styles.recipe} key={recipe.productId}>
              <strong>{recipe.productName}</strong>
              <small>
                {formatStockQuantity(recipe.quantity, ingredient.baseUnit)} / sale
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.movements} aria-labelledby="recent-movements-title">
        <header className={styles.sectionHeader}>
          <h3 id="recent-movements-title">Recent movements</h3>
          <button
            type="button"
            disabled={!detail?.movements.length}
            onClick={() => setShowHistory(true)}
          >
            View all
          </button>
        </header>
        <div className={styles.movementList}>
          {isLoading ? <p className={styles.state}>Loading movements…</p> : null}
          {!isLoading && recentMovements.length === 0 ? (
            <p className={styles.state}>No movements recorded.</p>
          ) : null}
          {recentMovements.map((movement) => (
            <article className={styles.movement} key={movement.id}>
              <span>
                <strong>{movementLabel(movement.movementType)}</strong>
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
          Adjust count
        </button>
        <button
          className={styles.receive}
          type="button"
          onClick={() => onReceivePurchase(ingredient)}
        >
          <ArrowDown width={15} height={15} aria-hidden="true" />
          Receive
        </button>
      </footer>

      {message ? <p className={styles.notice}>{message}</p> : null}
      <button
        type="button"
        className={styles.save}
        onClick={save}
        disabled={saving || !name.trim() || invalidThreshold}
      >
        <Save width={16} height={16} aria-hidden="true" />
        <span>{saving ? 'Saving…' : 'Save changes'}</span>
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
              <small>APPEND-ONLY RECORD</small>
              <h3 id="movement-history-title">Movement history</h3>
            </span>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              aria-label="Close movement history"
            >
              <X width={17} height={17} aria-hidden="true" />
            </button>
          </header>
          <div className={styles.historyRows}>
            {detail.movements.map((movement) => (
              <article key={movement.id}>
                <span>
                  <strong>{movementLabel(movement.movementType)}</strong>
                  <small>
                    {movement.reason} · {movement.actorLabel ?? 'Unknown actor'} ·{' '}
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
