import type { Doc } from '../_generated/dataModel';
import { conflict } from './management';

export function salePaymentTotals(
  paymentMethodValue: 'Cash' | 'Card',
  totalCentimes: number,
  tenders?: Array<{
    paymentMethod?: 'Cash' | 'Card';
    dueCentimes: number;
  }>,
) {
  const totals = new Map<string, number>();
  for (const tender of tenders?.length
    ? tenders
    : [{ paymentMethod: paymentMethodValue, dueCentimes: totalCentimes }]) {
    const method = tender.paymentMethod ?? paymentMethodValue;
    totals.set(method, (totals.get(method) ?? 0) + tender.dueCentimes);
  }
  return totals;
}

function subtractMetric(value: number, amount: number, label: string) {
  if (!Number.isSafeInteger(value) || !Number.isSafeInteger(amount) || amount < 0 || value < amount) {
    return conflict(`Saved ${label} cannot be reversed safely.`);
  }
  return value - amount;
}

export function cancelMetric(
  metric: Doc<'dailyMetrics'>,
  original: Doc<'sales'>,
  items: Doc<'saleItems'>[],
  movements: Doc<'stockMovements'>[],
) {
  const totalsByPaymentMethod = metric.totalsByPaymentMethod.map((row) => ({ ...row }));
  for (const [method, amount] of salePaymentTotals(
    original.paymentMethod === 'Card' ? 'Card' : 'Cash',
    original.totalCentimes,
    original.receiptSnapshot.tenders,
  )) {
    const payment = totalsByPaymentMethod.find((row) => row.paymentMethod === method);
    if (!payment) return conflict('Saved payment summary is incomplete.');
    payment.totalCentimes = subtractMetric(payment.totalCentimes, amount, 'payment total');
    payment.orderCount = subtractMetric(payment.orderCount, 1, 'payment count');
  }
  const totalsByServiceMode = metric.totalsByServiceMode.map((row) => ({ ...row }));
  const service = totalsByServiceMode.find((row) => row.serviceMode === original.serviceMode);
  if (!service) return conflict('Saved service summary is incomplete.');
  service.totalCentimes = subtractMetric(service.totalCentimes, original.totalCentimes, 'service total');
  service.orderCount = subtractMetric(service.orderCount, 1, 'service count');
  const productTotals = metric.productTotals.map((row) => ({ ...row }));
  const categoryTotals = metric.categoryTotals.map((row) => ({ ...row }));
  for (const item of items) {
    if (!item.productId) return conflict('Saved product history is incomplete.');
    const product = productTotals.find((row) => row.productId === item.productId);
    if (!product) return conflict('Saved product summary is incomplete.');
    product.quantity = subtractMetric(product.quantity, item.quantity, 'product quantity');
    product.totalCentimes = subtractMetric(product.totalCentimes, item.lineTotalCentimes, 'product total');
    const categoryMatches = item.categoryId
      ? categoryTotals.filter((row) => row.categoryId === item.categoryId)
      : categoryTotals.filter((row) => row.categoryName === product.categoryName);
    const category = categoryMatches.length === 1 ? categoryMatches[0] : undefined;
    if (!category && (item.categoryId || product.categoryName)) {
      return conflict('Saved category summary is incomplete.');
    }
    if (category) {
      category.quantity = subtractMetric(category.quantity, item.quantity, 'category quantity');
      category.totalCentimes = subtractMetric(category.totalCentimes, item.lineTotalCentimes, 'category total');
    }
  }
  const ingredientTotals = (metric.ingredientTotals ?? []).map((row) => ({ ...row }));
  for (const movement of movements) {
    const total = ingredientTotals.find((row) => row.ingredientId === movement.ingredientId);
    if (!total) return conflict('Saved ingredient summary is incomplete.');
    total.quantity = subtractMetric(total.quantity, -movement.quantityDelta, 'ingredient quantity');
  }
  const profileTotals = (metric.profileTotals ?? []).map((row) => ({ ...row }));
  if (original.staffProfileId) {
    const profile = profileTotals.find(
      (row) => row.staffProfileId === original.staffProfileId,
    );
    if (!profile) return conflict('Saved profile summary is incomplete.');
    profile.orderCount = subtractMetric(profile.orderCount, 1, 'profile order count');
    profile.itemCount = subtractMetric(
      profile.itemCount,
      items.reduce((sum, item) => sum + item.quantity, 0),
      'profile item count',
    );
    profile.netCentimes = subtractMetric(
      profile.netCentimes,
      original.totalCentimes,
      'profile net sales',
    );
  }
  return {
    grossCentimes: subtractMetric(metric.grossCentimes, original.totalCentimes, 'gross total'),
    netCentimes: subtractMetric(metric.netCentimes, original.totalCentimes, 'net total'),
    orderCount: subtractMetric(metric.orderCount, 1, 'order count'),
    cancelledCentimes: metric.cancelledCentimes + original.totalCentimes,
    totalsByPaymentMethod: totalsByPaymentMethod.filter((row) => row.orderCount > 0),
    totalsByServiceMode: totalsByServiceMode.filter((row) => row.orderCount > 0),
    productTotals: productTotals.filter((row) => row.quantity > 0),
    categoryTotals: categoryTotals.filter((row) => row.quantity > 0),
    profileTotals: profileTotals.filter((row) => row.orderCount > 0),
    ingredientTotals: ingredientTotals.filter((row) => row.quantity > 0),
    ingredientUsageEventCount: subtractMetric(metric.ingredientUsageEventCount ?? 0, movements.length, 'ingredient usage count'),
    ingredientCostCentimes: subtractMetric(metric.ingredientCostCentimes ?? 0, original.ingredientCostCentimes ?? 0, 'ingredient cost'),
    completeCostSaleCount: subtractMetric(metric.completeCostSaleCount ?? 0, original.costStatus === 'complete' ? 1 : 0, 'complete-cost sale count'),
    incompleteCostSaleCount: subtractMetric(metric.incompleteCostSaleCount ?? 0, original.costStatus === 'incomplete' ? 1 : 0, 'incomplete-cost sale count'),
  };
}
