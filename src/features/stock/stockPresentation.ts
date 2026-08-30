import type {
  ManagedIngredient,
  ManagedStockMovement,
  StockBaseUnit,
} from './stockManagementTypes';

export { formatStockQuantity } from '../../lib/stock.ts';

export type StockUnitGroup = 'all' | 'liquids' | 'weighed' | 'pieces';
export type StockLevelFilter = 'all' | 'low' | 'healthy';

export function unitGroup(unit: StockBaseUnit): Exclude<StockUnitGroup, 'all'> {
  if (unit === 'millilitre') return 'liquids';
  if (unit === 'piece') return 'pieces';
  return 'weighed';
}

export function unitGroupLabel(unit: StockBaseUnit) {
  const group = unitGroup(unit);
  if (group === 'liquids') return 'Liquids';
  if (group === 'pieces') return 'Pieces';
  return 'Weighed';
}

export function baseUnitLabel(unit: StockBaseUnit) {
  if (unit === 'millilitre') return 'Millilitres';
  if (unit === 'milligram') return 'Milligrams';
  if (unit === 'gram') return 'Grams';
  return 'Pieces';
}

export function ingredientLevel(
  ingredient: ManagedIngredient,
): 'Low' | 'Healthy' | 'Archived' {
  if (ingredient.status === 'archived') return 'Archived';
  return ingredient.currentStockQuantity <= ingredient.lowStockThreshold
    ? 'Low'
    : 'Healthy';
}

export function matchesLevelFilter(
  ingredient: ManagedIngredient,
  filter: StockLevelFilter,
) {
  const level = ingredientLevel(ingredient).toLowerCase();
  return ingredient.status === 'active'
    && (filter === 'all' || level === filter);
}

export function movementLabel(
  type: ManagedStockMovement['movementType'],
) {
  if (type === 'sale') return 'Sale deduction';
  if (type === 'stock-addition') return 'Stock received';
  if (type === 'purchase') return 'Purchase received';
  if (type === 'purchase-reversal') return 'Purchase correction reversal';
  if (type === 'manual-adjustment') return 'Count adjustment';
  if (type === 'cancellation' || type === 'refund') {
    return 'Cancellation reversal';
  }
  return 'Opening balance';
}
