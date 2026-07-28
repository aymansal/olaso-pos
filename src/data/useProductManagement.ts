import {
  useMutation,
  useQuery_experimental as useQuery,
} from 'convex/react';
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
import { keyFromName, newMutationId } from './managementMutations';

export function useProductManagement(selectedProductId?: string) {
  const categoryQuery = useQuery({ query: api.categories.list, args: {} });
  const productQuery = useQuery({ query: api.products.list, args: {} });
  const modifierQuery = useQuery({ query: api.modifiers.list, args: {} });
  const recipeQuery = useQuery({
    query: api.recipes.getEditorData,
    args: selectedProductId
      ? { productId: selectedProductId as Id<'products'> }
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

  const rawProducts =
    productQuery.status === 'success' ? productQuery.data : [];
  const products: ManagedProduct[] = rawProducts.map((product) => ({
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
  }));
  const categories: ManagedCategory[] =
    categoryQuery.status === 'success'
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
    modifierQuery.status === 'success'
      ? modifierQuery.data.ingredients.map((ingredient) => ({
          id: ingredient._id,
          key: ingredient.key,
          name: ingredient.name,
          baseUnit: ingredient.baseUnit,
        }))
      : [];
  const modifierGroups: ManagedModifierGroup[] =
    modifierQuery.status === 'success'
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
    recipeQuery.status === 'success'
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

  return {
    categories,
    products,
    modifierGroups,
    ingredients,
    recipeData,
    isLoading: queries.some((result) => result.status === 'pending'),
    isRecipeLoading:
      Boolean(selectedProductId) && recipeQuery.status === 'pending',
    error:
      queryError?.status === 'error'
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
      saveCategoryMutation({
        ...(input.id
          ? {
              id: input.id as Id<'categories'>,
              expectedRevision: input.expectedRevision,
            }
          : { key: keyFromName(input.name, `category-${Date.now()}`) }),
        name: input.name,
        sortOrder: input.sortOrder,
        clientMutationId: newMutationId(),
      }),
    setCategoryArchived: (
      id: string,
      archived: boolean,
      expectedRevision: number,
    ) =>
      setCategoryArchivedMutation({
        id: id as Id<'categories'>,
        archived,
        expectedRevision,
        clientMutationId: newMutationId(),
      }),
    saveProduct: (input: ProductSaveInput) =>
      saveProductMutation({
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
      }),
    setProductStatus: (
      id: string,
      status: ManagedProduct['status'],
      expectedRevision: number,
    ) =>
      setProductStatusMutation({
        id: id as Id<'products'>,
        status,
        expectedRevision,
        clientMutationId: newMutationId(),
      }),
    saveModifierGroup: (group: ManagedModifierGroup) =>
      saveModifierGroupMutation({
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
      }),
    setModifierGroupArchived: (
      id: string,
      archived: boolean,
      expectedRevision: number,
    ) =>
      setModifierGroupArchivedMutation({
        id: id as Id<'modifierGroups'>,
        archived,
        expectedRevision,
        clientMutationId: newMutationId(),
      }),
    saveRecipeVersion: (
      product: ManagedProduct,
      items: { ingredientId: string; quantity: number }[],
    ) =>
      saveRecipeVersionMutation({
        productId: product.id as Id<'products'>,
        expectedProductRevision: product.revision,
        clientMutationId: newMutationId(),
        items: items.map((item) => ({
          ingredientId: item.ingredientId as Id<'ingredients'>,
          quantity: item.quantity,
        })),
      }),
  };
}
