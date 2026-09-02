import { ChevronLeft, ChevronRight } from '@boxicons/react';
import type { CSSProperties } from 'react';
import type { ManagedIngredient } from '../../stockManagementTypes';
import {
  formatStockQuantity,
  ingredientLevel,
  unitGroupLabel,
} from '../../stockPresentation';
import { visiblePageIndexes } from '../../../../lib/pagination';
import { useT } from '../../../../lib/locale';
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
  const t = useT();
  const selectedIndex = ingredients.findIndex(
    (ingredient) => ingredient.id === selectedIngredientId,
  );

  return (
    <section className={styles.table} aria-labelledby="inventory-table-title">
      <header className={styles.header}>
        <h2 id="inventory-table-title">{t('Inventory')}</h2>
        <small>{t('Updated after every saved movement')}</small>
      </header>

      <div className={styles.columns} aria-hidden="true">
        {columns.map((column) => <span key={column}>{t(column)}</span>)}
      </div>

      <div
        className={styles.rows}
        style={{ '--index': Math.max(0, selectedIndex) } as CSSProperties}
      >
        {isLoading ? <p className={styles.state}>{t('Loading live stock…')}</p> : null}
        {error ? <p className={styles.state}>{t(error)}</p> : null}
        {!isLoading && !error && ingredients.length === 0 ? (
          <p className={styles.state}>{t('No ingredients match these filters.')}</p>
        ) : null}
        {!isLoading && !error && selectedIndex >= 0 ? (
          <span className={styles.indicator} aria-hidden="true" />
        ) : null}
        {!isLoading && !error
          ? ingredients.map((ingredient) => {
              const selected = ingredient.id === selectedIngredientId;
              const level = ingredientLevel(ingredient);
              return (
                <button
                  type="button"
                  className={styles.row}
                  aria-pressed={selected}
                  onClick={() => onSelect(ingredient.id)}
                  key={ingredient.id}
                >
                  <span className={styles.ingredient}>
                    <strong>{ingredient.name}</strong>
                  </span>
                  <span className={styles.cell}>
                    {t(unitGroupLabel(ingredient.baseUnit))}
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
                      {t(level)}
                    </strong>
                  </span>
                </button>
              );
            })
          : null}
      </div>

      <footer className={styles.footer}>
        <span>
          {totalItems === 1
            ? t('Showing {shown} of {total} live record', {
                shown: ingredients.length,
                total: totalItems,
              })
            : t('Showing {shown} of {total} live records', {
                shown: ingredients.length,
                total: totalItems,
              })}
        </span>
        <nav className={styles.pagination} aria-label={t('Stock pagination')}>
          <button
            type="button"
            aria-label={t('Previous stock page')}
            disabled={isLoading || page <= 0}
            onClick={() => onPageChange(page - 1)}
            key="prev"
          >
            <ChevronLeft width={14} height={14} aria-hidden="true" />
          </button>
          {isLoading
            ? null
            : visiblePageIndexes(page, pageCount).map((index) => (
            <button
              type="button"
              className={index === page ? styles.current : undefined}
              aria-current={index === page ? 'page' : undefined}
              aria-label={t('Page {page}', { page: index + 1 })}
              onClick={() => onPageChange(index)}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label={t('Next stock page')}
            disabled={isLoading || page >= pageCount - 1}
            onClick={() => onPageChange(page + 1)}
            key="next"
          >
            <ChevronRight width={14} height={14} aria-hidden="true" />
          </button>
        </nav>
      </footer>
    </section>
  );
}
