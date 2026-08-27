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
  inventoryValueCentimes?: number;
  costStatus: 'complete' | 'incomplete';
  valuationRevision: number;
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
    | 'purchase'
    | 'purchase-reversal'
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

export type ManagedPurchase = {
  id: string;
  packageLabel: string;
  packageCount: number;
  quantityPerPackage: number;
  totalQuantity: number;
  packagePriceCentimes: number;
  totalCostCentimes: number;
  transactionType: 'received' | 'reversal';
  receivedAt: number;
};

export type ManagedIngredientDetail = {
  movements: ManagedStockMovement[];
  purchases: ManagedPurchase[];
  linkedRecipes: ManagedLinkedRecipe[];
};

export type IngredientSaveInput = {
  id?: string;
  name: string;
  baseUnit: StockBaseUnit;
  lowStockThreshold: number;
  openingQuantity?: number;
  openingCostCentimes?: number;
  expectedRevision?: number;
};

export type StockAdjustmentMode = 'receive' | 'set-count';
