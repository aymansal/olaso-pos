export type ManagedCategory = {
  id: string;
  key: string;
  name: string;
  sortOrder: number;
  status: 'active' | 'archived';
  revision: number;
  productCount: number;
};

export type ManagedProduct = {
  id: string;
  key: string;
  categoryId: string;
  name: string;
  receiptName: string;
  basePriceCentimes: number;
  status: 'active' | 'unavailable' | 'archived';
  imageAssetKey?: string;
  sortOrder: number;
  modifierGroupIds: string[];
  currentRecipeVersionId?: string;
  revision: number;
  updatedAt: number;
};

export type ManagedIngredient = {
  id: string;
  key: string;
  name: string;
  baseUnit: 'millilitre' | 'gram' | 'milligram' | 'piece';
};

export type ManagedIngredientEffect = {
  ingredientId: string;
  quantityDelta: number;
};

export type ManagedModifierOption = {
  id?: string;
  key: string;
  name: string;
  priceDeltaCentimes: number;
  ingredientEffects: ManagedIngredientEffect[];
  status: 'active' | 'archived';
  sortOrder: number;
};

export type ManagedModifierGroup = {
  id?: string;
  key?: string;
  name: string;
  required: boolean;
  minSelections: number;
  maxSelections: number;
  status: 'active' | 'archived';
  sortOrder: number;
  revision?: number;
  options: ManagedModifierOption[];
};

export type ManagedRecipeItem = {
  ingredientId: string;
  ingredientName: string;
  baseUnit: ManagedIngredient['baseUnit'];
  quantity: number;
};

export type ManagedRecipeData = {
  versionNumber?: number;
  versions: {
    id: string;
    versionNumber: number;
    status: 'draft' | 'active' | 'superseded';
  }[];
  items: ManagedRecipeItem[];
  ingredients: ManagedIngredient[];
};

export type ManagedProductCost = {
  complete: boolean;
  hasRecipe: boolean;
  costCentimes?: number;
  missingIngredientIds?: string[];
};

export type ProductSaveInput = {
  id?: string;
  name: string;
  categoryId: string;
  basePriceCentimes: number;
  status: 'active' | 'unavailable';
  sortOrder: number;
  modifierGroupIds: string[];
  expectedRevision?: number;
};
