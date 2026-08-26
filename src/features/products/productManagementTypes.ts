export type ManagedCategory = {
  id: string;
  key: string;
  name: string;
  artworkKey: string;
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

export type ManagedProductSize = {
  id?: string;
  productId: string;
  key?: string;
  name: string;
  priceCentimes: number;
  sortOrder: number;
  isDefault: boolean;
  status: 'active' | 'unavailable' | 'archived';
  revision?: number;
};

export type ManagedChoiceEffect = {
  id?: string;
  effectType: 'add' | 'replace' | 'set-exact' | 'remove';
  ingredientId: string;
  replacementIngredientId?: string;
  quantity: number;
  sortOrder: number;
  sizeQuantities: Array<{ productSizeId: string; quantity: number }>;
};

export type ManagedChoiceValue = {
  id?: string;
  key?: string;
  name: string;
  priceDeltaCentimes: number;
  isDefaultSelected: boolean;
  sortOrder: number;
  status: 'active' | 'archived';
  sizeRules: Array<{
    productSizeId: string;
    available: boolean;
    priceDeltaCentimes?: number;
  }>;
  effects: ManagedChoiceEffect[];
};

export type ManagedChoiceSection = {
  id?: string;
  productId: string;
  key?: string;
  name: string;
  selectionMode: 'single' | 'multiple';
  required: boolean;
  minimumSelections: number;
  maximumSelections: number;
  sortOrder: number;
  status: 'active' | 'archived';
  revision?: number;
  productSizeIds: string[];
  values: ManagedChoiceValue[];
};

export type ManagedRecipeData = {
  versionNumber?: number;
  versions: {
    id: string;
    versionNumber: number;
    status: 'draft' | 'active' | 'superseded';
  }[];
  items: ManagedRecipeItem[];
  sizeQuantities: Array<{
    ingredientId: string;
    productSizeId: string;
    quantity: number;
  }>;
  ingredients: ManagedIngredient[];
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
