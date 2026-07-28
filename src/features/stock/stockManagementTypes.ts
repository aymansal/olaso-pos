export type StockBaseUnit =
  | 'millilitre'
  | 'gram'
  | 'milligram'
  | 'piece';

export type ManagedIngredient = {
  id: string;
  key: string;
  name: string;
  baseUnit: StockBaseUnit;
  currentStockQuantity: number;
  lowStockThreshold: number;
  usedToday: number;
  status: 'active' | 'archived';
  revision: number;
  updatedAt: number;
};

export type InventoryMetrics = {
  ingredientCount: number;
  lowStockCount: number;
  movementCount: number;
  adjustmentCount: number;
};

export type ManagedStockMovement = {
  id: string;
  quantityDelta: number;
  movementType:
    | 'sale'
    | 'stock-addition'
    | 'manual-adjustment'
    | 'cancellation'
    | 'refund'
    | 'seed';
  reason: string;
  actorLabel?: string;
  businessDate: string;
  createdAt: number;
};

export type ManagedLinkedRecipe = {
  productId: string;
  productName: string;
  quantity: number;
};

export type ManagedIngredientDetail = {
  movements: ManagedStockMovement[];
  linkedRecipes: ManagedLinkedRecipe[];
};

export type IngredientSaveInput = {
  id?: string;
  name: string;
  baseUnit: StockBaseUnit;
  lowStockThreshold: number;
  openingQuantity?: number;
  expectedRevision?: number;
};

export type StockAdjustmentMode = 'receive' | 'set-count';
