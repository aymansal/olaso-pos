import type {
  ManagedIngredient,
  ManagedStockMovement,
  StockBaseUnit,
} from './stockManagementTypes';
import type { StockIconName } from './components/StockIcon/StockIcon';
export { formatStockQuantity } from '../../lib/stock';

export type StockUnitGroup = 'all' | 'liquids' | 'weighed' | 'pieces';
export type StockLevelFilter = 'all' | 'low' | 'healthy' | 'archived';

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

export function ingredientIcon(ingredient: ManagedIngredient): StockIconName {
  if (ingredient.key.includes('coffee')) return 'coffee';
  if (
    ingredient.key.includes('matcha') ||
    ingredient.key.includes('hojicha') ||
    ingredient.key.includes('tea')
  ) {
    return 'leaf';
  }
  if (ingredient.baseUnit === 'millilitre') return 'drop';
  return 'package';
}

export function movementLabel(
  type: ManagedStockMovement['movementType'],
) {
  if (type === 'sale') return 'Sale deduction';
  if (type === 'stock-addition') return 'Stock received';
  if (type === 'manual-adjustment') return 'Count adjustment';
  if (type === 'cancellation') return 'Cancellation reversal';
  if (type === 'refund') return 'Refund reversal';
  return 'Opening balance';
}
