import { ArrowDown, Pencil, SliderAlt, X } from '@boxicons/react';
import { useEffect, useState } from 'react';
import type {
  ManagedIngredient,
  ManagedIngredientDetail,
  StockAdjustmentMode,
} from '../../stockManagementTypes';
import {
  baseUnitLabel,
  formatStockQuantity,
  ingredientIcon,
  ingredientLevel,
  movementLabel,
} from '../../stockPresentation';
import { formatMoney } from '../../../../lib/money';
import { StockIcon } from '../StockIcon/StockIcon';
import styles from './StockDetailPanel.module.css';

interface StockDetailPanelProps {
  ingredient?: ManagedIngredient;
  detail?: ManagedIngredientDetail;
  isLoading: boolean;
  onEdit: (ingredient: ManagedIngredient) => void;
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
  onEdit,
  onAdjust,
  onReceivePurchase,
}: StockDetailPanelProps) {
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setShowHistory(false);
  }, [ingredient?.id]);

  if (!ingredient) {
    return (
      <aside className={styles.panel} aria-labelledby="stock-item-title">
        <div className={styles.empty}>
          <SliderAlt width={25} height={25} aria-hidden="true" />
          <h2 id="stock-item-title">Select an ingredient</h2>
          <p>Choose a live stock record to review its balance and movements.</p>
        </div>
      </aside>
    );
  }

  const level = ingredientLevel(ingredient);
  const difference =
    ingredient.currentStockQuantity - ingredient.lowStockThreshold;
  const recentMovements = detail?.movements.slice(0, 2) ?? [];
  const linkedRecipes = detail?.linkedRecipes.slice(0, 3) ?? [];
  const archived = ingredient.status === 'archived';
  const inventoryValue = ingredient.inventoryValueCentimes;
  const averageCost = inventoryValue === undefined || ingredient.currentStockQuantity === 0
    ? undefined : Math.round(inventoryValue / ingredient.currentStockQuantity);

  return (
    <aside className={styles.panel} aria-labelledby="stock-item-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h2 id="stock-item-title">Stock item</h2>
          <small>Ingredient details and movements</small>
        </span>
        <span className={styles.headerActions}>
          <button type="button" onClick={() => onEdit(ingredient)}>
            <Pencil width={12} height={12} aria-hidden="true" />
            Edit
          </button>
          <strong
            className={`${styles.stockStatus} ${styles[level.toLowerCase()]}`}
          >
            <span aria-hidden="true" />
            {level}
          </strong>
        </span>
      </header>

      <section className={styles.identity} aria-label="Selected ingredient">
        <span className={styles.identityLeft}>
          <span className={styles.artwork}>
            <StockIcon name={ingredientIcon(ingredient)} size={20} />
          </span>
          <span className={styles.identityCopy}>
            <strong>{ingredient.name}</strong>
            <small>{ingredient.key.toUpperCase()} · Revision {ingredient.revision}</small>
          </span>
        </span>
        <span className={styles.unit}>
          <small>BASE UNIT</small>
          <strong>{baseUnitLabel(ingredient.baseUnit)}</strong>
        </span>
      </section>

      <span className={`${styles.divider} ${styles.identityDivider}`} aria-hidden="true" />

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
        <p className={styles.costSummary}>{ingredient.costStatus === 'complete' && inventoryValue !== undefined ? <>Inventory value {formatMoney(inventoryValue)} · average {formatMoney(averageCost ?? 0)} / {formatStockQuantity(1, ingredient.baseUnit)}</> : 'Cost incomplete — receive a priced package before claiming inventory value.'}</p>
        <div
          className={`${styles.warning} ${level === 'Healthy' ? styles.warningHealthy : ''} ${archived ? styles.warningArchived : ''}`}
        >
          <span>
            {archived
              ? 'Archived ingredients remain linked to history and recipes.'
              : difference < 0
                ? `${formatStockQuantity(-difference, ingredient.baseUnit)} below minimum. Warning only; sales remain available.`
                : `${formatStockQuantity(difference, ingredient.baseUnit)} above minimum.`}
          </span>
        </div>
      </section>

      <span className={`${styles.divider} ${styles.levelSectionDivider}`} aria-hidden="true" />

      <section className={styles.recipes} aria-labelledby="linked-recipes-title">
        <header className={styles.sectionHeader}>
          <h3 id="linked-recipes-title">Linked recipes</h3>
          <small>
            {detail?.linkedRecipes.length ?? 0} product
            {(detail?.linkedRecipes.length ?? 0) === 1 ? "" : "s"}
          </small>
        </header>
        <div className={styles.recipeList}>
          {isLoading ? <p className={styles.state}>Loading recipe links…</p> : null}
          {!isLoading && linkedRecipes.length === 0 ? (
            <p className={styles.state}>No active recipes use this ingredient.</p>
          ) : null}
          {linkedRecipes.map((recipe) => (
            <article className={styles.recipe} key={recipe.productId}>
              <span className={styles.recipeIdentity}>
                <span className={styles.recipeIcon}>
                  <StockIcon name={ingredientIcon(ingredient)} size={13} />
                </span>
                <strong>{recipe.productName}</strong>
              </span>
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
          disabled={archived}
          onClick={() => onAdjust(ingredient, 'set-count')}
        >
          <SliderAlt width={15} height={15} aria-hidden="true" />
          <span>Adjust count</span>
        </button>
        <button
          className={styles.receive}
          type="button"
          disabled={archived}
          onClick={() => onReceivePurchase(ingredient)}
        >
          <ArrowDown width={15} height={15} aria-hidden="true" />
          <span>Receive purchase</span>
        </button>
      </footer>

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
