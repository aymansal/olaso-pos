import { ChevronLeft, ChevronRight } from '@boxicons/react';
import type { ManagedIngredient } from '../../stockManagementTypes';
import {
  formatStockQuantity,
  ingredientIcon,
  ingredientLevel,
  unitGroupLabel,
} from '../../stockPresentation';
import { StockIcon } from '../StockIcon/StockIcon';
import styles from './StockTable.module.css';

const columns = [
  'INGREDIENT',
  'UNIT GROUP',
  'ON HAND',
  'MINIMUM',
  'USED TODAY',
  'STATUS',
];

interface StockTableProps {
  ingredients: ManagedIngredient[];
  totalItems: number;
  selectedIngredientId?: string;
  page: number;
  pageCount: number;
  isLoading: boolean;
  error?: string;
  onSelect: (ingredientId: string) => void;
  onPageChange: (page: number) => void;
}

export function StockTable({
  ingredients,
  totalItems,
  selectedIngredientId,
  page,
  pageCount,
  isLoading,
  error,
  onSelect,
  onPageChange,
}: StockTableProps) {
  return (
    <section className={styles.table} aria-labelledby="inventory-table-title">
      <header className={styles.header}>
        <h2 id="inventory-table-title">Inventory</h2>
        <small>Updated after every saved movement</small>
      </header>

      <div className={styles.columns} aria-hidden="true">
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>

      <div className={styles.rows}>
        {isLoading ? <p className={styles.state}>Loading live stock…</p> : null}
        {error ? <p className={styles.state}>{error}</p> : null}
        {!isLoading && !error && ingredients.length === 0 ? (
          <p className={styles.state}>No ingredients match these filters.</p>
        ) : null}
        {!isLoading && !error
          ? ingredients.map((ingredient) => {
              const selected = ingredient.id === selectedIngredientId;
              const level = ingredientLevel(ingredient);
              return (
                <button
                  type="button"
                  className={`${styles.row} ${selected ? styles.selected : ''}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(ingredient.id)}
                  key={ingredient.id}
                >
                  <span className={styles.ingredient}>
                    <span
                      className={`${styles.icon} ${selected ? styles.selectedIcon : ''}`}
                    >
                      <StockIcon
                        name={ingredientIcon(ingredient)}
                        size={15}
                      />
                    </span>
                    <span className={styles.ingredientCopy}>
                      <strong>{ingredient.name}</strong>
                      <small>Base unit: {ingredient.baseUnit}</small>
                    </span>
                  </span>
                  <span className={styles.cell}>
                    {unitGroupLabel(ingredient.baseUnit)}
                  </span>
                  <strong
                    className={`${styles.cell} ${level === 'Low' ? styles.lowValue : ''}`}
                  >
                    {formatStockQuantity(
                      ingredient.currentStockQuantity,
                      ingredient.baseUnit,
                    )}
                  </strong>
                  <span className={styles.cell}>
                    {formatStockQuantity(
                      ingredient.lowStockThreshold,
                      ingredient.baseUnit,
                    )}
                  </span>
                  <span className={styles.cell}>
                    {formatStockQuantity(
                      -ingredient.usedToday,
                      ingredient.baseUnit,
                    )}
                  </span>
                  <span className={styles.statusCell}>
                    <strong
                      className={`${styles.status} ${styles[level.toLowerCase()]}`}
                    >
                      <span aria-hidden="true" />
                      {level}
                    </strong>
                  </span>
                </button>
              );
            })
          : null}
      </div>

      <footer className={styles.footer}>
        <span>
          Showing {ingredients.length} of {totalItems} live record
          {totalItems === 1 ? '' : 's'}
        </span>
        <span className={styles.pagination}>
          <button
            type="button"
            aria-label="Previous stock page"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft width={12} height={12} aria-hidden="true" />
          </button>
          <strong>{pageCount ? page + 1 : 0} / {pageCount}</strong>
          <button
            type="button"
            aria-label="Next stock page"
            disabled={page >= pageCount - 1}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight width={12} height={12} aria-hidden="true" />
          </button>
        </span>
      </footer>
    </section>
  );
}
