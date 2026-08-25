import { useCallback, useEffect, useState } from 'react';
import type { ManagedCategory, ManagedIngredient, ManagedModifierGroup, ManagedProduct, ManagedRecipeData, ProductSaveInput } from '../features/products/productManagementTypes.ts';
import {
  deleteLocalCategory,
  deleteLocalProduct,
  saveLocalCategory,
  saveLocalProduct,
  setLocalCategoryArchived,
  setLocalProductStatus,
} from './localCatalog.ts';
import { saveLocalModifierGroup, saveLocalRecipeVersion, setLocalModifierGroupArchived } from './localRecipes.ts';
import { loadOperationalCache, type OperationalCacheSnapshot } from './operationalCache.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

export function useProductManagement(selectedProductId?: string) {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [cache, setCache] = useState<OperationalCacheSnapshot>();
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const snapshot = await loadOperationalCache();
    setCache(snapshot); setError(''); return snapshot;
  }, []);
  useEffect(() => { void reload().catch(() => setError('Saved products are unavailable on this tablet.')); }, [reconnect.revision, reload]);
  const context = { deviceId: session.deviceId, actor: { staffProfileId: session.staffProfileId, name: session.name, role: session.role } };
  const products: ManagedProduct[] = (cache?.products ?? []).map((product) => ({
    id: product.id, key: product.key, categoryId: product.categoryId,
    name: product.name, receiptName: product.receiptName, basePriceCentimes: product.priceCentimes,
    status: product.status, imageAssetKey: product.imageAssetKey, sortOrder: product.sortOrder,
    modifierGroupIds: (cache?.productModifierGroups ?? []).filter((link) => link.productId === product.id).map((link) => link.modifierGroupId),
    currentRecipeVersionId: product.currentRecipeVersionId, revision: product.revision, updatedAt: product.updatedAt,
  }));
  const categories: ManagedCategory[] = (cache?.categories ?? []).map((category) => ({
    ...category,
    artworkKey: category.artworkKey,
    status: category.status ?? 'active',
    productCount: products.filter((product) => product.categoryId === category.id).length,
  }));
  const ingredients: ManagedIngredient[] = (cache?.ingredients ?? []).map((ingredient) => ({ id: ingredient.id, key: ingredient.id, name: ingredient.name, baseUnit: ingredient.baseUnit }));
  const modifierGroups: ManagedModifierGroup[] = (cache?.modifierGroups ?? []).map((group, index) => ({
    id: group.id, key: group.key, name: group.name, required: group.minimumSelections > 0,
    minSelections: group.minimumSelections, maxSelections: group.maximumSelections,
    status: group.status ?? 'active', sortOrder: group.sortOrder ?? index * 10 + 10, revision: group.revision,
    options: (cache?.modifierOptions ?? []).filter((option) => option.modifierGroupId === group.id).map((option) => ({
      id: option.id, key: option.key, name: option.name, priceDeltaCentimes: option.priceDeltaCentimes,
      ingredientEffects: option.ingredientEffects, status: option.status ?? 'active', sortOrder: option.sortOrder,
    })),
  }));
  const recipeData: ManagedRecipeData | undefined = selectedProductId ? (() => {
    const versions = (cache?.recipeVersions ?? []).filter((version) => version.productId === selectedProductId);
    const currentId = products.find((product) => product.id === selectedProductId)?.currentRecipeVersionId;
    const current = versions.find((version) => version.id === currentId);
    return {
      versionNumber: current?.version,
      versions: versions.map((version) => ({ id: version.id, versionNumber: version.version, status: version.id === currentId ? 'active' as const : 'superseded' as const })),
      items: (cache?.recipeItems ?? []).filter((item) => item.recipeVersionId === currentId).map((item) => {
        const ingredient = cache?.ingredients.find((row) => row.id === item.ingredientId);
        return { ingredientId: item.ingredientId, ingredientName: ingredient?.name ?? 'Unknown ingredient', baseUnit: ingredient?.baseUnit ?? 'piece', quantity: item.quantity };
      }), ingredients,
    };
  })() : undefined;
  const cost = (() => {
    if (!selectedProductId) return undefined;
    const product = products.find((row) => row.id === selectedProductId);
    if (!product?.currentRecipeVersionId) {
      return { complete: false, hasRecipe: false, missingIngredientIds: [] };
    }
    const items = (cache?.recipeItems ?? []).filter(
      (item) => item.recipeVersionId === product.currentRecipeVersionId,
    );
    const missing: string[] = [];
    let costCentimes = 0;
    for (const item of items) {
      const ingredient = cache?.ingredients.find((row) => row.id === item.ingredientId);
      if (!ingredient || ingredient.costStatus !== 'complete'
          || ingredient.inventoryValueCentimes === undefined
          || ingredient.currentStockQuantity <= 0) {
        missing.push(item.ingredientId);
        continue;
      }
      costCentimes += Number(
        (BigInt(ingredient.inventoryValueCentimes) * BigInt(item.quantity)
          + BigInt(ingredient.currentStockQuantity) / 2n)
        / BigInt(ingredient.currentStockQuantity),
      );
    }
    return missing.length
      ? { complete: false, hasRecipe: true, missingIngredientIds: missing }
      : { complete: true, hasRecipe: true, costCentimes, missingIngredientIds: [] };
  })();
  const save = async <T,>(operation: Promise<T>) => {
    const result = await operation; await reload(); void reconnect.run('automatic').catch(() => undefined); return result;
  };
  return {
    categories, products, modifierGroups, ingredients, recipeData, cost,
    isLoading: !cache && !error, isRecipeLoading: false, error: error || undefined,
    saveCategory: (input: Parameters<typeof saveLocalCategory>[1]) => save(saveLocalCategory(context, input)),
    setCategoryArchived: (id: string, archived: boolean, revision: number) => save(setLocalCategoryArchived(context, id, archived, revision)),
    deleteCategory: (category: Pick<ManagedCategory, 'id' | 'revision'>) =>
      save(deleteLocalCategory(context, category)),
    saveProduct: (input: ProductSaveInput) => save(saveLocalProduct(context, input)),
    setProductStatus: (id: string, status: ManagedProduct['status'], revision: number) => save(setLocalProductStatus(context, { id, revision }, status)),
    deleteProduct: (product: Pick<ManagedProduct, 'id' | 'revision'>) =>
      save(deleteLocalProduct(context, product)),
    saveModifierGroup: (group: ManagedModifierGroup) => save(saveLocalModifierGroup(context, group)),
    setModifierGroupArchived: (id: string, archived: boolean, revision: number) => save(setLocalModifierGroupArchived(context, id, archived, revision)),
    saveRecipeVersion: (product: ManagedProduct, items: { ingredientId: string; quantity: number }[]) => save(saveLocalRecipeVersion(context, product, items)),
  };
}
