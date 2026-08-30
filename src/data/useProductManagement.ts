import { useCallback, useEffect, useRef, useState } from 'react';
import type { ManagedCategory, ManagedChoiceSection, ManagedIngredient, ManagedProduct, ManagedProductCost, ManagedProductSize, ManagedRecipeData, ProductSaveInput } from '../features/products/productManagementTypes.ts';
import {
  deleteLocalCategory,
  deleteLocalProduct,
  saveLocalCategory,
  saveLocalProduct,
  setLocalCategoryArchived,
  setLocalProductStatus,
} from './localCatalog.ts';
import { saveLocalRecipeVersion } from './localRecipes.ts';
import {
  copyLocalChoiceSections,
  deleteLocalChoiceSection,
  deleteLocalProductSize,
  saveLocalChoiceSection,
  saveLocalProductSize,
} from './localProductConfiguration.ts';
import { loadOperationalCache, type OperationalCacheSnapshot } from './operationalCache.ts';
import { computeProductCostRange } from '../lib/productCostRange.ts';
import { useReconnect } from './reconnectContext.tsx';
import { useStaffSession } from './sessionContext.tsx';

export function useProductManagement(selectedProductId?: string) {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [cache, setCache] = useState<OperationalCacheSnapshot>();
  const loadedRevision = useRef<number | undefined>(undefined);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const snapshot = await loadOperationalCache();
    setCache(snapshot); setError(''); return snapshot;
  }, []);
  useEffect(() => {
    if (loadedRevision.current === reconnect.revision) return;
    void reload().then(() => {
      loadedRevision.current = reconnect.revision;
    }).catch(() => setError('Saved products are unavailable on this tablet.'));
  }, [reconnect.revision, reload]);
  const context = { deviceId: session.deviceId, actor: { staffProfileId: session.staffProfileId, name: session.name, role: session.role } };
  const products: ManagedProduct[] = (cache?.products ?? []).map((product) => ({
    id: product.id, key: product.key, categoryId: product.categoryId,
    name: product.name, receiptName: product.receiptName, basePriceCentimes: product.priceCentimes,
    status: product.status, imageAssetKey: product.imageAssetKey, imageJpeg: product.imageJpeg, sortOrder: product.sortOrder,
    currentRecipeVersionId: product.currentRecipeVersionId, revision: product.revision, updatedAt: product.updatedAt,
  }));
  const categories: ManagedCategory[] = (cache?.categories ?? []).map((category) => ({
    ...category,
    artworkKey: category.artworkKey,
    status: category.status ?? 'active',
    productCount: products.filter((product) => product.categoryId === category.id).length,
  }));
  const ingredients: ManagedIngredient[] = (cache?.ingredients ?? []).map((ingredient) => ({ id: ingredient.id, key: ingredient.id, name: ingredient.name, baseUnit: ingredient.baseUnit }));
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
      }),
      sizeQuantities: (cache?.recipeSizeQuantities ?? [])
        .filter((item) => item.recipeVersionId === currentId)
        .map((item) => ({
          ingredientId: item.ingredientId,
          productSizeId: item.productSizeId,
          quantity: item.quantity,
        })),
      ingredients,
    };
  })() : undefined;
  const productSizes: ManagedProductSize[] = (cache?.productSizes ?? []).map((size) => ({ ...size }));
  const choiceSections: ManagedChoiceSection[] = (cache?.productChoiceSections ?? [])
    .filter((section) =>
      section.productId === selectedProductId && section.status !== 'archived')
    .map((section) => ({
    id: section.id, productId: section.productId, key: section.key, name: section.name,
    selectionMode: section.selectionMode, required: section.required,
    minimumSelections: section.minimumSelections, maximumSelections: section.maximumSelections,
    sortOrder: section.sortOrder, status: section.status, revision: section.revision,
    productSizeIds: (cache?.productChoiceSectionSizes ?? []).filter((link) => link.sectionId === section.id)
      .map((link) => link.productSizeId),
    values: (cache?.productChoiceValues ?? []).filter((value) =>
      value.sectionId === section.id && value.status !== 'archived')
      .map((value) => ({
        id: value.id, key: value.key, name: value.name, priceDeltaCentimes: value.priceDeltaCentimes,
        isDefaultSelected: value.isDefaultSelected, sortOrder: value.sortOrder, status: value.status,
        sizeRules: (cache?.productChoiceValueSizes ?? []).filter((rule) => rule.valueId === value.id)
          .map((rule) => ({ productSizeId: rule.productSizeId, available: rule.available,
            ...(rule.priceDeltaCentimes === null ? {} : { priceDeltaCentimes: rule.priceDeltaCentimes }) })),
        effects: (cache?.productChoiceValueEffects ?? []).filter((effect) => effect.valueId === value.id)
          .map((effect) => ({
            id: effect.id, effectType: effect.effectType, ingredientId: effect.ingredientId,
            replacementIngredientId: effect.replacementIngredientId, quantity: effect.quantity,
            sortOrder: effect.sortOrder,
            sizeQuantities: (cache?.productChoiceValueEffectSizes ?? [])
              .filter((row) => row.effectId === effect.id)
              .map((row) => ({ productSizeId: row.productSizeId, quantity: row.quantity })),
          })),
      })),
  }));
  const productCost: ManagedProductCost | undefined = selectedProductId && cache
    ? (() => {
      const currentId = products.find((product) => product.id === selectedProductId)
        ?.currentRecipeVersionId;
      if (!currentId) return { complete: false, hasRecipe: false };
      const sections = (cache.productChoiceSections ?? []).filter(
        (section) =>
          section.productId === selectedProductId && section.status !== 'archived',
      );
      const sectionIds = new Set(sections.map((section) => section.id));
      const values = (cache.productChoiceValues ?? []).filter((value) =>
        sectionIds.has(value.sectionId) && value.status !== 'archived',
      );
      const valueIds = new Set(values.map((value) => value.id));
      const effects = (cache.productChoiceValueEffects ?? []).filter((effect) =>
        valueIds.has(effect.valueId),
      );
      const effectIds = new Set(effects.map((effect) => effect.id));
      return computeProductCostRange({
        sizes: (cache.productSizes ?? []).filter(
          (size) => size.productId === selectedProductId,
        ),
        recipeItems: (cache.recipeItems ?? [])
          .filter((item) => item.recipeVersionId === currentId)
          .map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
          })),
        sizeQuantities: (cache.recipeSizeQuantities ?? []).filter(
          (row) => row.recipeVersionId === currentId,
        ),
        sections,
        sectionSizeIds: (cache.productChoiceSectionSizes ?? []).filter((link) =>
          sectionIds.has(link.sectionId),
        ),
        values,
        valueSizes: (cache.productChoiceValueSizes ?? []).filter((row) =>
          valueIds.has(row.valueId),
        ),
        effects,
        effectSizes: (cache.productChoiceValueEffectSizes ?? []).filter((row) =>
          effectIds.has(row.effectId),
        ),
        ingredients: cache.ingredients,
      });
    })()
    : undefined;
  const save = async <T,>(operation: Promise<T>) => {
    const result = await operation; await reload(); void reconnect.run('automatic').catch(() => undefined); return result;
  };
  return {
    categories, products, ingredients, recipeData, productSizes, choiceSections,
    productCost,
    isLoading: !cache && !error, isRecipeLoading: false, error: error || undefined,
    saveCategory: (input: Parameters<typeof saveLocalCategory>[1]) => save(saveLocalCategory(context, input)),
    setCategoryArchived: (id: string, archived: boolean, revision: number) => save(setLocalCategoryArchived(context, id, archived, revision)),
    deleteCategory: (category: Pick<ManagedCategory, 'id' | 'revision'>) =>
      save(deleteLocalCategory(context, category)),
    saveProduct: (input: ProductSaveInput) => save(saveLocalProduct(context, input)),
    setProductStatus: (id: string, status: ManagedProduct['status'], revision: number) => save(setLocalProductStatus(context, { id, revision }, status)),
    deleteProduct: (product: Pick<ManagedProduct, 'id' | 'revision'>) =>
      save(deleteLocalProduct(context, product)),
    saveRecipeVersion: (product: ManagedProduct, items: { ingredientId: string; quantity: number }[],
      sizeQuantities?: Array<{ ingredientId: string; productSizeId: string; quantity: number }>) =>
      save(saveLocalRecipeVersion(context, product, items, sizeQuantities)),
    saveProductSize: (input: ManagedProductSize) => save(saveLocalProductSize(context, input)),
    deleteProductSize: (size: Required<Pick<ManagedProductSize, 'id' | 'revision'>>) =>
      save(deleteLocalProductSize(context, size)),
    saveChoiceSection: (section: ManagedChoiceSection) => save(saveLocalChoiceSection(context, section)),
    deleteChoiceSection: (section: Required<Pick<ManagedChoiceSection, 'id' | 'revision'>>) =>
      save(deleteLocalChoiceSection(context, section)),
    copyChoiceSections: (sourceProductId: string, destinationProductId: string,
      sizeNameMap?: Record<string, string>) =>
      save(copyLocalChoiceSections(context, sourceProductId, destinationProductId, sizeNameMap)),
  };
}
