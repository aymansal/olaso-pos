import { RefreshCw, Search, Plus, SliderAlt, Layers, AlertTriangle } from '@boxicons/react';
import type {
  InventoryMetrics,
  ManagedIngredient,
} from '../../stockManagementTypes';
import type {
  StockLevelFilter,
  StockUnitGroup,
} from '../../stockPresentation';
import { StockTable } from '../StockTable/StockTable';
import styles from './StockInventoryPanel.module.css';

const summaryIcons = {
  stack: Layers,
  warning: AlertTriangle,
  movement: RefreshCw,
  adjustment: SliderAlt,
} as const;

interface StockInventoryPanelProps {
  metrics: InventoryMetrics;
  ingredients: ManagedIngredient[];
  totalItems: number;
  selectedIngredientId?: string;
  search: string;
  unitGroup: StockUnitGroup;
  levelFilter: StockLevelFilter;
  page: number;
  pageCount: number;
  isLoading: boolean;
  error?: string;
  onSearchChange: (value: string) => void;
  onUnitGroupChange: (value: StockUnitGroup) => void;
  onLevelFilterChange: (value: StockLevelFilter) => void;
  onSelect: (ingredientId: string) => void;
  onPageChange: (page: number) => void;
  onAddIngredient: () => void;
}

export function StockInventoryPanel({
  metrics,
  ingredients,
  totalItems,
  selectedIngredientId,
  search,
  unitGroup,
  levelFilter,
  page,
  pageCount,
  isLoading,
  error,
  onSearchChange,
  onUnitGroupChange,
  onLevelFilterChange,
  onSelect,
  onPageChange,
  onAddIngredient,
}: StockInventoryPanelProps) {
  const summaries = [
    {
      icon: 'stack',
      value: metrics.ingredientCount,
      label: 'Active ingredients',
      tone: 'green',
    },
    {
      icon: 'warning',
      value: metrics.lowStockCount,
      label: 'Low stock',
      tone: 'low',
    },
    {
      icon: 'movement',
      value: metrics.movementCount,
      label: 'Movements today',
      tone: 'value',
    },
    {
      icon: 'adjustment',
      value: metrics.adjustmentCount,
      label: 'Counts corrected',
      tone: 'neutral',
    },
  ] as const;

  return (
    <section className={styles.panel} aria-labelledby="stock-inventory-title">
      <header className={styles.header}>
        <span className={styles.heading}>
          <h1 id="stock-inventory-title">Stock inventory</h1>
          <small>Ingredients and packaging measured in their real units</small>
        </span>
        <button
          className={styles.addIngredient}
          type="button"
          onClick={onAddIngredient}
        >
          <Plus width={15} height={15} aria-hidden="true" />
          <span>Add ingredient</span>
        </button>
      </header>

      <div className={styles.summary} aria-label="Stock summary">
        {summaries.map(({ icon, value, label, tone }, index) => {
          const Icon = summaryIcons[icon];
          return (
            <div className={styles.summaryEntry} key={label}>
              {index > 0 ? (
                <span className={styles.summaryDivider} aria-hidden="true" />
              ) : null}
              <span className={`${styles.summaryIcon} ${styles[tone]}`}>
                <Icon width={15} height={15} aria-hidden="true" />
              </span>
              <span className={styles.summaryCopy}>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search width={15} height={15} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search stock"
            placeholder="Search ingredients or packaging"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className={styles.filter}>
          <select
            aria-label="Filter stock unit group"
            value={unitGroup}
            onChange={(event) =>
              onUnitGroupChange(event.target.value as StockUnitGroup)
            }
          >
            <option value="all">All units</option>
            <option value="liquids">Liquids</option>
            <option value="weighed">Weighed</option>
            <option value="pieces">Pieces</option>
          </select>
        </label>
        <label className={styles.statusFilter}>
          <select
            aria-label="Filter stock level"
            value={levelFilter}
            onChange={(event) =>
              onLevelFilterChange(event.target.value as StockLevelFilter)
            }
          >
            <option value="all">All stock levels</option>
            <option value="low">Low stock</option>
            <option value="healthy">Healthy</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <StockTable
        ingredients={ingredients}
        totalItems={totalItems}
        selectedIngredientId={selectedIngredientId}
        page={page}
        pageCount={pageCount}
        isLoading={isLoading}
        error={error}
        onSelect={onSelect}
        onPageChange={onPageChange}
      />
    </section>
  );
}
