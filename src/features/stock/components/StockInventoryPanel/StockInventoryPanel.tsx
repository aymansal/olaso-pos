import { Search, Plus, X } from '@boxicons/react';
import type {
  ManagedIngredient,
} from '../../stockManagementTypes';
import type {
  StockLevelFilter,
  StockUnitGroup,
} from '../../stockPresentation';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import { StockTable } from '../StockTable/StockTable';
import { useT } from '../../../../lib/locale';
import styles from './StockInventoryPanel.module.css';

interface StockInventoryPanelProps {
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
  const t = useT();
  return (
    <section className={styles.panel} aria-labelledby="stock-inventory-title">
      <header className={styles.header}>
        <h1 className={styles.heading} id="stock-inventory-title">
          {t('Stock inventory')}
        </h1>
        <button
          className={styles.addIngredient}
          type="button"
          onClick={onAddIngredient}
        >
          <Plus width={15} height={15} aria-hidden="true" />
          <span>{t('Add ingredient')}</span>
        </button>
      </header>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search width={15} height={15} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('Search stock')}
            placeholder={t('Search ingredients or packaging')}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search !== '' ? (
            <button
              type="button"
              className={styles.clear}
              aria-label={t('Clear search')}
              onClick={() => onSearchChange('')}
            >
              <X width={14} height={14} aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <div className={styles.filter}>
          <MenuSelect
            ariaLabel="Filter stock unit group"
            value={unitGroup}
            onChange={(id) => onUnitGroupChange(id as StockUnitGroup)}
            options={[
              { id: 'all', label: 'All units' },
              { id: 'liquids', label: 'Liquids' },
              { id: 'weighed', label: 'Weighed' },
              { id: 'pieces', label: 'Pieces' },
            ]}
          />
        </div>
        <div className={styles.statusFilter}>
          <MenuSelect
            ariaLabel="Filter stock level"
            value={levelFilter}
            onChange={(id) => onLevelFilterChange(id as StockLevelFilter)}
            options={[
              { id: 'all', label: 'All stock levels' },
              { id: 'low', label: 'Low stock' },
              { id: 'healthy', label: 'Healthy' },
            ]}
          />
        </div>
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
