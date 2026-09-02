import { useCallback, useEffect, useRef, useState } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
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
  deleteLocalIngredient,
  saveLocalIngredient,
  setLocalIngredientArchived,
} from './localInventory.ts';
import { useConnectionStatus } from './connectionContext';
import {
  loadOfflineIngredientDetail,
  loadOfflineInventory,
  overlayCloudUsedToday,
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
  const { available, foreground } = useConnectionStatus();
  const convex = useConvex();
  const [inventory, setInventory] =
    useState<Awaited<ReturnType<typeof loadOfflineInventory>>>();
  const [detail, setDetail] = useState<ManagedIngredientDetail>();
  const [error, setError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const loadedKey = useRef<string | undefined>(undefined);
  const loadedDetail = useRef<string | undefined>(undefined);
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
    if (available === true && foreground) {
      try {
        const cloud = await convex.query(api.reports.getSummary, {
          fromDate: businessDate,
          toDate: businessDate,
          sessionToken: session.token,
          deviceId: session.deviceId,
        });
        const merged = overlayCloudUsedToday(saved, cloud.current.ingredientTotals);
        setInventory(merged);
        return merged;
      } catch {
        return saved;
      }
    }
    return saved;
  }, [
    available,
    businessDate,
    convex,
    foreground,
    session.deviceId,
    session.token,
  ]);

  useEffect(() => {
    const requestKey = `${reconnect.revision}:${businessDate}:${available}:${foreground}`;
    if (loadedKey.current === requestKey) return;
    void reload().then(() => {
      loadedKey.current = requestKey;
    }).catch(() => setError('Saved stock is unavailable on this tablet.'));
  }, [available, businessDate, foreground, reconnect.revision, reload]);

  useEffect(() => {
    if (!selectedIngredientId) {
      setDetail(undefined);
      setDetailLoading(false);
      loadedDetail.current = undefined;
      return;
    }
    const detailKey = `${reconnect.revision}:${selectedIngredientId}`;
    if (loadedDetail.current === detailKey) return;
    let active = true;
    if (!detail) setDetailLoading(true);
    void loadOfflineIngredientDetail(selectedIngredientId).then(
      (saved) => {
        if (active) {
          setDetail(saved as ManagedIngredientDetail);
          loadedDetail.current = detailKey;
        }
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
    const current = await reload();
    if (selectedIngredientId && current.ingredients.some(
      (ingredient) => ingredient.id === selectedIngredientId,
    )) {
      const savedDetail = await loadOfflineIngredientDetail(selectedIngredientId);
      setDetail(savedDetail as ManagedIngredientDetail);
    } else if (selectedIngredientId) {
      setDetail(undefined);
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
    deleteIngredient: (ingredient: ManagedIngredient) =>
      save(deleteLocalIngredient(context, ingredient)),
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
