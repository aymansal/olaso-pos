export type StockBaseUnit =
  | 'millilitre'
  | 'gram'
  | 'milligram'
  | 'piece';

export function formatStockQuantity(
  quantity: number,
  unit: StockBaseUnit,
) {
  const sign = quantity < 0 ? '−' : '';
  const absolute = Math.abs(quantity);
  let value = absolute;
  let suffix = unit === 'piece' ? 'pc' : unit === 'gram' ? 'g' : 'mg';

  if (unit === 'millilitre') {
    if (absolute >= 1000) {
      value = absolute / 1000;
      suffix = 'L';
    } else {
      suffix = 'ml';
    }
  } else if (unit === 'gram' && absolute >= 1000) {
    value = absolute / 1000;
    suffix = 'kg';
  } else if (unit === 'milligram' && absolute >= 1000) {
    value = absolute / 1000;
    suffix = 'g';
  }

  return `${sign}${new Intl.NumberFormat('en-MA', {
    maximumFractionDigits: 2,
  }).format(value)} ${suffix}`;
}
