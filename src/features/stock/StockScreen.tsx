import { useEffect, useMemo, useRef, useState } from 'react';
import { useInventoryManagement } from '../../data/useInventoryManagement';
import { IngredientDialog } from './components/IngredientDialog/IngredientDialog';
import { StockAdjustmentDialog } from './components/StockAdjustmentDialog/StockAdjustmentDialog';
import { StockDetailPanel } from './components/StockDetailPanel/StockDetailPanel';
import { StockInventoryPanel } from './components/StockInventoryPanel/StockInventoryPanel';
import { PurchaseDialog } from './components/PurchaseDialog/PurchaseDialog';
import type {
  IngredientSaveInput,
  ManagedIngredient,
  StockAdjustmentMode,
} from './stockManagementTypes';
import {
  matchesLevelFilter,
  type StockLevelFilter,
  type StockUnitGroup,
  unitGroup as ingredientUnitGroup,
} from './stockPresentation';
import { useT } from '../../lib/locale';
import styles from './StockScreen.module.css';

const PAGE_SIZE = 7;

export function StockScreen({
  initialLevelFilter = 'all',
}: {
  initialLevelFilter?: StockLevelFilter;
}) {
  const t = useT();
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>();
  const [search, setSearch] = useState('');
  const [unitGroup, setUnitGroup] = useState<StockUnitGroup>('all');
  const [levelFilter, setLevelFilter] =
    useState<StockLevelFilter>(initialLevelFilter);
  const [page, setPage] = useState(0);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [adjustment, setAdjustment] = useState<{
    ingredient: ManagedIngredient;
    mode: StockAdjustmentMode;
  }>();
  const [purchaseIngredient, setPurchaseIngredient] = useState<ManagedIngredient>();
  const inventory = useInventoryManagement(selectedIngredientId);

  useEffect(() => {
    setLevelFilter(initialLevelFilter);
  }, [initialLevelFilter]);

  const visibleIngredients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return inventory.ingredients.filter((ingredient) => {
      return (
        (!normalizedSearch ||
          ingredient.name.toLocaleLowerCase().includes(normalizedSearch) ||
          ingredient.key.toLocaleLowerCase().includes(normalizedSearch)) &&
        (unitGroup === 'all' ||
          ingredientUnitGroup(ingredient.baseUnit) === unitGroup) &&
        matchesLevelFilter(ingredient, levelFilter)
      );
    });
  }, [inventory.ingredients, levelFilter, search, unitGroup]);

  useEffect(() => {
    if (inventory.isLoading || inventory.error) return;
    if (visibleIngredients.some((ingredient) => ingredient.id === selectedIngredientId)) return;
    setSelectedIngredientId(visibleIngredients[0]?.id);
  }, [
    inventory.error,
    inventory.isLoading,
    selectedIngredientId,
    visibleIngredients,
  ]);

  const pageCount = inventory.isLoading
    ? 0
    : Math.max(1, Math.ceil(visibleIngredients.length / PAGE_SIZE));
  const safePage = pageCount === 0 ? 0 : Math.min(page, pageCount - 1);
  const pageIngredients = visibleIngredients.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const selectedIngredient = inventory.ingredients.find(
    (ingredient) => ingredient.id === selectedIngredientId,
  );
  const filterKey = `${levelFilter}\u0000${search}\u0000${unitGroup}`;
  const previousFilters = useRef(filterKey);
  useEffect(() => {
    if (previousFilters.current === filterKey) return;
    previousFilters.current = filterKey;
    setPage(0);
  }, [filterKey]);

  async function saveIngredient(input: IngredientSaveInput) {
    const result = await inventory.saveIngredient(input);
    setSelectedIngredientId(result.id);
  }

  return (
    <main className={styles.screen} aria-label={t('Olaso stock')}>
      <StockInventoryPanel
        ingredients={pageIngredients}
        totalItems={visibleIngredients.length}
        selectedIngredientId={selectedIngredientId}
        search={search}
        unitGroup={unitGroup}
        levelFilter={levelFilter}
        page={safePage}
        pageCount={pageCount}
        isLoading={inventory.isLoading}
        error={inventory.error}
        onSearchChange={setSearch}
        onUnitGroupChange={setUnitGroup}
        onLevelFilterChange={setLevelFilter}
        onSelect={setSelectedIngredientId}
        onPageChange={setPage}
        onAddIngredient={() => setShowAddIngredient(true)}
      />
      <StockDetailPanel
        ingredient={selectedIngredient}
        detail={inventory.detail}
        isLoading={inventory.isDetailLoading}
        onSave={saveIngredient}
        onDelete={async (ingredient) => {
          const replacement = inventory.ingredients.find(
            (item) => item.id !== ingredient.id && item.status === 'active',
          );
          await inventory.deleteIngredient(ingredient);
          setSelectedIngredientId(replacement?.id);
        }}
        onAdjust={(ingredient, mode) => setAdjustment({ ingredient, mode })}
        onReceivePurchase={setPurchaseIngredient}
      />
      {showAddIngredient ? (
        <IngredientDialog
          onClose={() => setShowAddIngredient(false)}
          onSave={saveIngredient}
        />
      ) : null}
      {adjustment ? (
        <StockAdjustmentDialog
          ingredient={adjustment.ingredient}
          mode={adjustment.mode}
          onClose={() => setAdjustment(undefined)}
          onSave={async (ingredient, mode, quantity, reason) => {
            await inventory.recordAdjustment(
              ingredient,
              mode,
              quantity,
              reason,
            );
          }}
        />
      ) : null}
      {purchaseIngredient ? <PurchaseDialog ingredient={purchaseIngredient} onClose={() => setPurchaseIngredient(undefined)} onSave={async (input) => { await inventory.receivePurchase(purchaseIngredient, input); }} /> : null}
    </main>
  );
}
