import { useCallback, useEffect, useState } from 'react';
import type {
  IngredientSaveInput,
  InventoryMetrics,
  ManagedIngredient,
  ManagedIngredientDetail,
  StockAdjustmentMode,
} from '../features/stock/stockManagementTypes.ts';
import { localBusinessDate } from '../lib/date.ts';
import {
  receiveLocalPurchase,
  recordLocalStockAdjustment,
  saveLocalIngredient,
  setLocalIngredientArchived,
} from './localInventory.ts';
import {
  loadOfflineIngredientDetail,
  loadOfflineInventory,
} from './offlineViews.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

const emptyMetrics: InventoryMetrics = {
  ingredientCount: 0,
  lowStockCount: 0,
  movementCount: 0,
  adjustmentCount: 0,
};

export function useInventoryManagement(selectedIngredientId?: string) {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [inventory, setInventory] =
    useState<Awaited<ReturnType<typeof loadOfflineInventory>>>();
  const [detail, setDetail] = useState<ManagedIngredientDetail>();
  const [error, setError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const businessDate = localBusinessDate();
  const context = {
    deviceId: session.deviceId,
    actor: {
      staffProfileId: session.staffProfileId,
      name: session.name,
      role: session.role,
    },
  };

  const reload = useCallback(async () => {
    const saved = await loadOfflineInventory();
    setInventory(saved);
    setError('');
    return saved;
  }, []);

  useEffect(() => {
    void reload().catch(() =>
      setError('Saved stock is unavailable on this tablet.'));
  }, [reconnect.revision, reload]);

  useEffect(() => {
    if (!selectedIngredientId) {
      setDetail(undefined);
      setDetailLoading(false);
      return;
    }
    let active = true;
    setDetailLoading(true);
    void loadOfflineIngredientDetail(selectedIngredientId).then(
      (saved) => {
        if (active) setDetail(saved as ManagedIngredientDetail);
      },
      () => {
        if (active) {
          setDetail({ movements: [], purchases: [], linkedRecipes: [] });
        }
      },
    ).finally(() => {
      if (active) setDetailLoading(false);
    });
    return () => { active = false; };
  }, [reconnect.revision, selectedIngredientId]);

  const save = async <T,>(operation: Promise<T>) => {
    const result = await operation;
    await reload();
    if (selectedIngredientId) {
      const savedDetail = await loadOfflineIngredientDetail(selectedIngredientId);
      setDetail(savedDetail as ManagedIngredientDetail);
    }
    void reconnect.run('automatic').catch(() => undefined);
    return result;
  };

  return {
    businessDate,
    ingredients: (inventory?.ingredients ?? []) as ManagedIngredient[],
    metrics: inventory?.metrics ?? emptyMetrics,
    detail,
    isLoading: !inventory && !error,
    isDetailLoading: Boolean(selectedIngredientId) && detailLoading,
    error: error || undefined,
    saveIngredient: (input: IngredientSaveInput) =>
      save(saveLocalIngredient(context, input, businessDate)),
    setIngredientArchived: (
      ingredient: ManagedIngredient,
      archived: boolean,
    ) => save(setLocalIngredientArchived(context, ingredient, archived)),
    recordAdjustment: (
      ingredient: ManagedIngredient,
      mode: StockAdjustmentMode,
      quantity: number,
      reason: string,
    ) => save(recordLocalStockAdjustment(
      context,
      ingredient,
      mode,
      quantity,
      reason,
      businessDate,
    )),
    receivePurchase: (
      ingredient: ManagedIngredient,
      input: {
        packageLabel: string;
        packageCount: number;
        quantityPerPackage: number;
        packagePriceCentimes: number;
        supplierLabel?: string;
        note?: string;
      },
    ) => save(receiveLocalPurchase(context, ingredient, {
      ...input,
      businessDate,
    })),
  };
}
