import {
  useMutation,
  useQuery_experimental as useQuery,
} from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import type {
  IngredientSaveInput,
  InventoryMetrics,
  ManagedIngredient,
  ManagedIngredientDetail,
  ManagedPurchase,
  StockAdjustmentMode,
} from '../features/stock/stockManagementTypes';
import { keyFromName, newMutationId } from './managementMutations';
import { useStaffSession } from './sessionContext';

function currentBusinessDate() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

export function useInventoryManagement(selectedIngredientId?: string) {
  const session = useStaffSession();
  const sessionArgs = { sessionToken: session.token, deviceId: session.deviceId };
  const businessDate = currentBusinessDate();
  const inventoryQuery = useQuery({
    query: api.inventory.list,
    args: { ...sessionArgs, businessDate },
  });
  const detailQuery = useQuery({
    query: api.inventory.getDetail,
    args: selectedIngredientId
      ? { ...sessionArgs, ingredientId: selectedIngredientId as Id<'ingredients'> }
      : 'skip',
  });
  const saveIngredientMutation = useMutation(api.inventory.saveIngredient);
  const setIngredientArchivedMutation = useMutation(
    api.inventory.setIngredientArchived,
  );
  const recordAdjustmentMutation = useMutation(
    api.inventory.recordAdjustment,
  );
  const receivePurchaseMutation = useMutation(api.inventory.receivePurchase);

  const ingredients: ManagedIngredient[] =
    inventoryQuery.status === 'success'
      ? inventoryQuery.data.ingredients.map((ingredient) => ({
          id: ingredient._id,
          key: ingredient.key,
          name: ingredient.name,
          baseUnit: ingredient.baseUnit,
          currentStockQuantity: ingredient.currentStockQuantity,
          inventoryValueCentimes: ingredient.inventoryValueCentimes,
          costStatus: ingredient.costStatus ?? 'incomplete',
          valuationRevision: ingredient.valuationRevision ?? 0,
          lowStockThreshold: ingredient.lowStockThreshold,
          usedToday: ingredient.usedToday,
          status: ingredient.status,
          revision: ingredient.revision,
          updatedAt: ingredient.updatedAt,
        }))
      : [];
  const metrics: InventoryMetrics =
    inventoryQuery.status === 'success'
      ? inventoryQuery.data.metrics
      : {
          ingredientCount: 0,
          lowStockCount: 0,
          movementCount: 0,
          adjustmentCount: 0,
        };
  const detail: ManagedIngredientDetail | undefined =
    detailQuery.status === 'success'
      ? {
          movements: detailQuery.data.movements.map((movement) => ({
            id: movement._id,
            quantityDelta: movement.quantityDelta,
            movementType: movement.movementType,
            reason: movement.reason,
            actorLabel: movement.actorLabel,
            businessDate: movement.businessDate,
            createdAt: movement.createdAt,
          })),
          purchases: detailQuery.data.purchases.map((purchase): ManagedPurchase => ({
            id: purchase._id,
            packageLabel: purchase.packageLabel,
            packageCount: purchase.packageCount,
            quantityPerPackage: purchase.quantityPerPackage,
            totalQuantity: purchase.totalQuantity,
            packagePriceCentimes: purchase.packagePriceCentimes,
            totalCostCentimes: purchase.totalCostCentimes,
            transactionType: purchase.transactionType,
            receivedAt: purchase.receivedAt,
          })),
          linkedRecipes: detailQuery.data.linkedRecipes.map((recipe) => ({
            productId: recipe.productId,
            productName: recipe.productName,
            quantity: recipe.quantity,
          })),
        }
      : undefined;
  const queryError =
    inventoryQuery.status === 'error'
      ? inventoryQuery.error
      : detailQuery.status === 'error'
        ? detailQuery.error
        : undefined;

  return {
    businessDate,
    ingredients,
    metrics,
    detail,
    isLoading: inventoryQuery.status === 'pending',
    isDetailLoading:
      Boolean(selectedIngredientId) && detailQuery.status === 'pending',
    error: queryError?.message,
    saveIngredient: (input: IngredientSaveInput) =>
      saveIngredientMutation({
        ...sessionArgs,
        ...(input.id
          ? {
              id: input.id as Id<'ingredients'>,
              expectedRevision: input.expectedRevision,
            }
          : {
              key: keyFromName(
                input.name,
                `ingredient-${Date.now()}`,
              ),
              openingQuantity: input.openingQuantity ?? 0,
            }),
        name: input.name,
        baseUnit: input.baseUnit,
        lowStockThreshold: input.lowStockThreshold,
        businessDate,
        clientMutationId: newMutationId(),
      }),
    setIngredientArchived: (
      ingredient: ManagedIngredient,
      archived: boolean,
    ) =>
      setIngredientArchivedMutation({
        ...sessionArgs,
        id: ingredient.id as Id<'ingredients'>,
        archived,
        expectedRevision: ingredient.revision,
        clientMutationId: newMutationId(),
      }),
    recordAdjustment: (
      ingredient: ManagedIngredient,
      mode: StockAdjustmentMode,
      quantity: number,
      reason: string,
    ) =>
      recordAdjustmentMutation({
        ...sessionArgs,
        ingredientId: ingredient.id as Id<'ingredients'>,
        mode,
        quantity,
        reason,
        expectedRevision: ingredient.revision,
        businessDate,
        clientMutationId: newMutationId(),
      }),
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
    ) =>
      receivePurchaseMutation({
        ...sessionArgs,
        ingredientId: ingredient.id as Id<'ingredients'>,
        ...input,
        receivedAt: Date.now(),
        businessDate,
        expectedRevision: ingredient.revision,
        clientMutationId: newMutationId(),
      }),
  };
}
