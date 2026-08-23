import {
  useMutation,
  useQuery_experimental as useQuery,
} from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import type {
  ManagedCategory,
  ManagedIngredient,
  ManagedModifierGroup,
  ManagedProduct,
  ManagedRecipeData,
  ProductSaveInput,
} from '../features/products/productManagementTypes';
import { useConnectionStatus } from './connectionContext';
import { keyFromName, newMutationId } from './managementMutations';
import {
  loadOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache';
import { useStaffSession } from './sessionContext';

export function useProductManagement(selectedProductId?: string) {
  const { available } = useConnectionStatus();
  const [offline, setOffline] = useState<OperationalCacheSnapshot>();
  const [offlineError, setOfflineError] = useState('');
  const session = useStaffSession();
  const sessionArgs = { sessionToken: session.token, deviceId: session.deviceId };
  const onlineArgs = available === true ? sessionArgs : 'skip';
  const categoryQuery = useQuery({ query: api.categories.list, args: onlineArgs });
  const productQuery = useQuery({ query: api.products.list, args: onlineArgs });
  const modifierQuery = useQuery({ query: api.modifiers.list, args: onlineArgs });
  const recipeQuery = useQuery({
    query: api.recipes.getEditorData,
    args: available === true && selectedProductId
      ? { ...sessionArgs, productId: selectedProductId as Id<'products'> }
      : 'skip',
  });
  const costQuery = useQuery({
    query: api.recipes.getCost,
    args: available === true && selectedProductId
      ? { ...sessionArgs, productId: selectedProductId as Id<'products'> }
      : 'skip',
  });

  const saveCategoryMutation = useMutation(api.categories.save);
  const setCategoryArchivedMutation = useMutation(
    api.categories.setArchived,
  );
  const saveProductMutation = useMutation(api.products.save);
  const setProductStatusMutation = useMutation(api.products.setStatus);
  const saveModifierGroupMutation = useMutation(api.modifiers.saveGroup);
  const setModifierGroupArchivedMutation = useMutation(
    api.modifiers.setGroupArchived,
  );
  const saveRecipeVersionMutation = useMutation(api.recipes.saveVersion);

  useEffect(() => {
    if (available !== false) return;
    let active = true;
    loadOperationalCache().then(
      (snapshot) => {
        if (active) {
          setOffline(snapshot);
          setOfflineError('');
        }
      },
      () => active && setOfflineError('Saved products are unavailable on this tablet.'),
    );
    return () => { active = false; };
  }, [available]);

  const products: ManagedProduct[] = available === false
    ? (offline?.products ?? []).map((product) => ({
        id: product.id,
        key: keyFromName(product.name, product.id),
        categoryId: product.categoryId,
        name: product.name,
        receiptName: product.receiptName,
        basePriceCentimes: product.priceCentimes,
        status: product.status,
        imageAssetKey: product.imageAssetKey,
        sortOrder: product.sortOrder,
        modifierGroupIds: (offline?.productModifierGroups ?? [])
          .filter((link) => link.productId === product.id)
          .map((link) => link.modifierGroupId),
        currentRecipeVersionId: product.currentRecipeVersionId,
        revision: product.revision,
        updatedAt: offline?.updatedAt ?? 0,
      }))
    : productQuery.status === 'success'
      ? productQuery.data.map((product) => ({
          id: product._id,
          key: product.key,
          categoryId: product.categoryId,
          name: product.name,
          receiptName: product.receiptName,
          basePriceCentimes: product.basePriceCentimes,
          status: product.status,
          imageAssetKey: product.imageAssetKey,
          sortOrder: product.sortOrder,
          modifierGroupIds: product.modifierGroupIds,
          currentRecipeVersionId: product.currentRecipeVersionId,
          revision: product.revision,
          updatedAt: product.updatedAt,
        }))
      : [];
  const categories: ManagedCategory[] =
    available === false
      ? (offline?.categories ?? []).map((category) => ({
          id: category.id,
          key: category.key,
          name: category.name,
          sortOrder: category.sortOrder,
          status: 'active',
          revision: category.revision,
          productCount: products.filter(
            (product) => product.categoryId === category.id,
          ).length,
        }))
      : categoryQuery.status === 'success'
      ? categoryQuery.data.map((category) => ({
          id: category._id,
          key: category.key,
          name: category.name,
          sortOrder: category.sortOrder,
          status: category.status,
          revision: category.revision,
          productCount: products.filter(
            (product) => product.categoryId === category._id,
          ).length,
        }))
      : [];

  const ingredients: ManagedIngredient[] =
    available === false
      ? (offline?.ingredients ?? []).map((ingredient) => ({
          id: ingredient.id,
          key: ingredient.id,
          name: ingredient.name,
          baseUnit: ingredient.baseUnit,
        }))
      : modifierQuery.status === 'success'
      ? modifierQuery.data.ingredients.map((ingredient) => ({
          id: ingredient._id,
          key: ingredient.key,
          name: ingredient.name,
          baseUnit: ingredient.baseUnit,
        }))
      : [];
  const modifierGroups: ManagedModifierGroup[] =
    available === false
      ? (offline?.modifierGroups ?? []).map((group, groupIndex) => ({
          id: group.id,
          key: group.id,
          name: group.name,
          required: group.minimumSelections > 0,
          minSelections: group.minimumSelections,
          maxSelections: group.maximumSelections,
          status: 'active',
          sortOrder: groupIndex * 10 + 10,
          revision: group.revision,
          options: (offline?.modifierOptions ?? [])
            .filter((option) => option.modifierGroupId === group.id)
            .map((option) => ({
              id: option.id,
              key: option.id,
              name: option.name,
              priceDeltaCentimes: option.priceDeltaCentimes,
              ingredientEffects: option.ingredientEffects,
              status: 'active',
              sortOrder: option.sortOrder,
            })),
        }))
      : modifierQuery.status === 'success'
      ? modifierQuery.data.groups.map((group) => ({
          id: group._id,
          key: group.key,
          name: group.name,
          required: group.required,
          minSelections: group.minSelections,
          maxSelections: group.maxSelections,
          status: group.status,
          sortOrder: group.sortOrder,
          revision: group.revision,
          options: modifierQuery.data.options
            .filter((option) => option.groupId === group._id)
            .map((option) => ({
              id: option._id,
              key: option.key,
              name: option.name,
              priceDeltaCentimes: option.priceDeltaCentimes,
              ingredientEffects: option.ingredientEffects.map((effect) => ({
                ingredientId: effect.ingredientId,
                quantityDelta: effect.quantityDelta,
              })),
              status: option.status,
              sortOrder: option.sortOrder,
            })),
        }))
      : [];

  const recipeData: ManagedRecipeData | undefined =
    available === false && selectedProductId
      ? (() => {
          const versions = (offline?.recipeVersions ?? []).filter(
            (version) => version.productId === selectedProductId,
          );
          const current = versions.find(
            (version) => version.id === products.find(
              (product) => product.id === selectedProductId,
            )?.currentRecipeVersionId,
          );
          return {
            versionNumber: current?.version,
            versions: versions.map((version) => ({
              id: version.id,
              versionNumber: version.version,
              status: version.id === current?.id ? 'active' as const : 'superseded' as const,
            })),
            items: (offline?.recipeItems ?? [])
              .filter((item) => item.recipeVersionId === current?.id)
              .map((item) => {
                const ingredient = offline?.ingredients.find(
                  (candidate) => candidate.id === item.ingredientId,
                );
                return {
                  ingredientId: item.ingredientId,
                  ingredientName: ingredient?.name ?? 'Unknown ingredient',
                  baseUnit: ingredient?.baseUnit ?? 'piece',
                  quantity: item.quantity,
                };
              }),
            ingredients,
          };
        })()
      : recipeQuery.status === 'success'
      ? {
          versionNumber: recipeQuery.data.recipe?.versionNumber,
          versions: recipeQuery.data.versions.map((version) => ({
            id: version._id,
            versionNumber: version.versionNumber,
            status: version.status,
          })),
          items: recipeQuery.data.items.map((item) => {
            const ingredient = recipeQuery.data.ingredients.find(
              (candidate) => candidate._id === item.ingredientId,
            );
            return {
              ingredientId: item.ingredientId,
              ingredientName: ingredient?.name ?? 'Unknown ingredient',
              baseUnit: ingredient?.baseUnit ?? 'piece',
              quantity: item.quantity,
            };
          }),
          ingredients: recipeQuery.data.ingredients.map((ingredient) => ({
            id: ingredient._id,
            key: ingredient.key,
            name: ingredient.name,
            baseUnit: ingredient.baseUnit,
          })),
        }
      : undefined;

  const queries = [categoryQuery, productQuery, modifierQuery];
  const queryError = queries.find((result) => result.status === 'error');
  const runOnline = <T,>(operation: () => Promise<T>) =>
    available === true
      ? operation()
      : Promise.reject(
          new Error('Products need internet. POS and Orders remain available offline.'),
        );

  return {
    categories,
    products,
    modifierGroups,
    ingredients,
    recipeData,
    cost: costQuery.status === 'success' ? costQuery.data : undefined,
    isLoading: available === undefined
      || (available === false ? !offline && !offlineError : queries.some((result) => result.status === 'pending')),
    isRecipeLoading:
      Boolean(selectedProductId)
      && (available === false ? !offline : recipeQuery.status === 'pending'),
    error:
      available === false
        ? offlineError || undefined
        : queryError?.status === 'error'
        ? queryError.error.message
        : recipeQuery.status === 'error'
          ? recipeQuery.error.message
          : undefined,
    saveCategory: (input: {
      id?: string;
      name: string;
      sortOrder: number;
      expectedRevision?: number;
    }) =>
      runOnline(() => saveCategoryMutation({
        ...sessionArgs,
        ...(input.id
          ? {
              id: input.id as Id<'categories'>,
              expectedRevision: input.expectedRevision,
            }
          : { key: keyFromName(input.name, `category-${Date.now()}`) }),
        name: input.name,
        sortOrder: input.sortOrder,
        clientMutationId: newMutationId(),
      })),
    setCategoryArchived: (
      id: string,
      archived: boolean,
      expectedRevision: number,
    ) =>
      runOnline(() => setCategoryArchivedMutation({
        ...sessionArgs,
        id: id as Id<'categories'>,
        archived,
        expectedRevision,
        clientMutationId: newMutationId(),
      })),
    saveProduct: (input: ProductSaveInput) =>
      runOnline(() => saveProductMutation({
        ...sessionArgs,
        ...(input.id
          ? {
              id: input.id as Id<'products'>,
              expectedRevision: input.expectedRevision,
            }
          : { key: keyFromName(input.name, `product-${Date.now()}`) }),
        categoryId: input.categoryId as Id<'categories'>,
        name: input.name,
        receiptName: input.name,
        basePriceCentimes: input.basePriceCentimes,
        status: input.status,
        sortOrder: input.sortOrder,
        modifierGroupIds: input.modifierGroupIds.map(
          (id) => id as Id<'modifierGroups'>,
        ),
        clientMutationId: newMutationId(),
      })),
    setProductStatus: (
      id: string,
      status: ManagedProduct['status'],
      expectedRevision: number,
    ) =>
      runOnline(() => setProductStatusMutation({
        ...sessionArgs,
        id: id as Id<'products'>,
        status,
        expectedRevision,
        clientMutationId: newMutationId(),
      })),
    saveModifierGroup: (group: ManagedModifierGroup) =>
      runOnline(() => saveModifierGroupMutation({
        ...sessionArgs,
        ...(group.id
          ? {
              id: group.id as Id<'modifierGroups'>,
              expectedRevision: group.revision,
            }
          : {
              key:
                group.key ??
                keyFromName(group.name, `modifier-${Date.now()}`),
            }),
        name: group.name,
        required: group.required,
        minSelections: group.minSelections,
        maxSelections: group.maxSelections,
        sortOrder: group.sortOrder,
        clientMutationId: newMutationId(),
        options: group.options.map((option) => ({
          ...(option.id
            ? { id: option.id as Id<'modifierOptions'> }
            : {}),
          key: option.key || keyFromName(option.name, `option-${Date.now()}`),
          name: option.name,
          priceDeltaCentimes: option.priceDeltaCentimes,
          ingredientEffects: option.ingredientEffects.map((effect) => ({
            ingredientId: effect.ingredientId as Id<'ingredients'>,
            quantityDelta: effect.quantityDelta,
          })),
          status: option.status,
          sortOrder: option.sortOrder,
        })),
      })),
    setModifierGroupArchived: (
      id: string,
      archived: boolean,
      expectedRevision: number,
    ) =>
      runOnline(() => setModifierGroupArchivedMutation({
        ...sessionArgs,
        id: id as Id<'modifierGroups'>,
        archived,
        expectedRevision,
        clientMutationId: newMutationId(),
      })),
    saveRecipeVersion: (
      product: ManagedProduct,
      items: { ingredientId: string; quantity: number }[],
    ) =>
      runOnline(() => saveRecipeVersionMutation({
        ...sessionArgs,
        productId: product.id as Id<'products'>,
        expectedProductRevision: product.revision,
        clientMutationId: newMutationId(),
        items: items.map((item) => ({
          ingredientId: item.ingredientId as Id<'ingredients'>,
          quantity: item.quantity,
        })),
      })),
  };
}
