import { useEffect, useMemo, useRef, useState } from 'react';
import { useInventoryManagement } from '../../data/useInventoryManagement';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
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
  ingredientLevel,
  type StockLevelFilter,
  type StockUnitGroup,
  unitGroup as ingredientUnitGroup,
} from './stockPresentation';
import styles from './StockScreen.module.css';

interface StockScreenProps {
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

const PAGE_SIZE = 5;

export function StockScreen({
  onNavigate,
  onOpenSettings,
}: StockScreenProps) {
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>();
  const [search, setSearch] = useState('');
  const [unitGroup, setUnitGroup] = useState<StockUnitGroup>('all');
  const [levelFilter, setLevelFilter] =
    useState<StockLevelFilter>('all');
  const [page, setPage] = useState(0);
  const [ingredientEditor, setIngredientEditor] =
    useState<'new' | ManagedIngredient>();
  const [adjustment, setAdjustment] = useState<{
    ingredient: ManagedIngredient;
    mode: StockAdjustmentMode;
  }>();
  const [purchaseIngredient, setPurchaseIngredient] = useState<ManagedIngredient>();
  const initialized = useRef(false);
  const inventory = useInventoryManagement(selectedIngredientId);

  useEffect(() => {
    if (initialized.current || inventory.isLoading || inventory.error) return;
    const preferred =
      inventory.ingredients.find(
        (ingredient) => ingredientLevel(ingredient) === 'Low',
      ) ?? inventory.ingredients.find((ingredient) => ingredient.status === 'active');
    setSelectedIngredientId(preferred?.id);
    initialized.current = true;
  }, [inventory.error, inventory.ingredients, inventory.isLoading]);

  const visibleIngredients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return inventory.ingredients.filter((ingredient) => {
      const level = ingredientLevel(ingredient).toLowerCase();
      return (
        (!normalizedSearch ||
          ingredient.name.toLocaleLowerCase().includes(normalizedSearch) ||
          ingredient.key.toLocaleLowerCase().includes(normalizedSearch)) &&
        (unitGroup === 'all' ||
          ingredientUnitGroup(ingredient.baseUnit) === unitGroup) &&
        (levelFilter === 'all' || level === levelFilter)
      );
    });
  }, [inventory.ingredients, levelFilter, search, unitGroup]);

  const pageCount = Math.ceil(visibleIngredients.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const pageIngredients = visibleIngredients.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const selectedIngredient = inventory.ingredients.find(
    (ingredient) => ingredient.id === selectedIngredientId,
  );
  const now = new Date();

  useEffect(() => {
    setPage(0);
  }, [levelFilter, search, unitGroup]);

  async function saveIngredient(input: IngredientSaveInput) {
    const result = await inventory.saveIngredient(input);
    setSelectedIngredientId(result.id);
  }

  return (
    <main className={styles.screen} aria-label="Olaso stock">
      <Header
        activePage="Stock"
        brand="olaso"
        onOpenSettings={onOpenSettings}
        dateLabel={new Intl.DateTimeFormat('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(now)}
        dateTime={now.toISOString().slice(0, 10)}
        onNavigate={onNavigate}
      />
      <StockInventoryPanel
        metrics={inventory.metrics}
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
        onAddIngredient={() => setIngredientEditor('new')}
      />
      <StockDetailPanel
        ingredient={selectedIngredient}
        detail={inventory.detail}
        isLoading={inventory.isDetailLoading}
        onEdit={setIngredientEditor}
        onAdjust={(ingredient, mode) => setAdjustment({ ingredient, mode })}
        onReceivePurchase={setPurchaseIngredient}
      />
      {ingredientEditor ? (
        <IngredientDialog
          ingredient={
            ingredientEditor === 'new' ? undefined : ingredientEditor
          }
          onClose={() => setIngredientEditor(undefined)}
          onSave={saveIngredient}
          onSetArchived={async (ingredient, archived) => {
            await inventory.setIngredientArchived(ingredient, archived);
          }}
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
