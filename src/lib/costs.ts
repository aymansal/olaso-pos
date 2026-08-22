export type InventoryValuation = {
  quantity: number;
  inventoryValueCentimes?: number;
  complete: boolean;
};

export type CostResult =
  | { complete: true; costCentimes: number }
  | { complete: false; missingIngredientIds: string[] };

function integer(value: number, label: string, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new Error(`${label} must be a safe integer of at least ${minimum}.`);
  }
  return value;
}

function roundedDivision(numerator: bigint, denominator: bigint) {
  if (denominator <= 0n) throw new Error('Division requires a positive denominator.');
  return (numerator + denominator / 2n) / denominator;
}

function numberFrom(value: bigint, label: string) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`${label} exceeds the supported integer range.`);
  }
  return Number(value);
}

export function allocateCentimes(
  totalCentimes: number,
  totalQuantity: number,
  allocatedQuantity: number,
) {
  integer(totalCentimes, 'Total cost');
  integer(totalQuantity, 'Total quantity', 1);
  integer(allocatedQuantity, 'Allocated quantity');
  if (allocatedQuantity > totalQuantity) {
    throw new Error('Allocated quantity cannot exceed the available quantity.');
  }
  if (allocatedQuantity === totalQuantity) return totalCentimes;
  return numberFrom(
    roundedDivision(BigInt(totalCentimes) * BigInt(allocatedQuantity), BigInt(totalQuantity)),
    'Allocated cost',
  );
}

export function receiveValuation(
  current: InventoryValuation,
  receivedQuantity: number,
  receivedCostCentimes: number,
): InventoryValuation {
  integer(current.quantity, 'Current quantity');
  integer(receivedQuantity, 'Received quantity', 1);
  integer(receivedCostCentimes, 'Received cost');
  const quantity = current.quantity + receivedQuantity;
  integer(quantity, 'Resulting quantity');
  if (current.quantity === 0) {
    return {
      quantity,
      inventoryValueCentimes: receivedCostCentimes,
      complete: true,
    };
  }
  if (!current.complete || current.inventoryValueCentimes === undefined) {
    return { quantity, complete: false };
  }
  integer(current.inventoryValueCentimes, 'Current inventory value');
  return {
    quantity,
    inventoryValueCentimes: numberFrom(
      BigInt(current.inventoryValueCentimes) + BigInt(receivedCostCentimes),
      'Resulting inventory value',
    ),
    complete: true,
  };
}

export function consumeValuation(
  current: InventoryValuation,
  consumedQuantity: number,
): { next: InventoryValuation; cost: CostResult } {
  integer(current.quantity, 'Current quantity');
  integer(consumedQuantity, 'Consumed quantity', 1);
  if (consumedQuantity > current.quantity) {
    throw new Error('Consumed quantity cannot exceed available quantity.');
  }
  if (!current.complete || current.inventoryValueCentimes === undefined) {
    return {
      next: { quantity: current.quantity - consumedQuantity, complete: false },
      cost: { complete: false, missingIngredientIds: [] },
    };
  }
  const costCentimes = allocateCentimes(
    current.inventoryValueCentimes,
    current.quantity,
    consumedQuantity,
  );
  return {
    next: {
      quantity: current.quantity - consumedQuantity,
      inventoryValueCentimes: current.inventoryValueCentimes - costCentimes,
      complete: true,
    },
    cost: { complete: true, costCentimes },
  };
}

export function combineCosts(costs: Array<CostResult>): CostResult {
  const missingIngredientIds = costs.flatMap((cost) =>
    cost.complete ? [] : cost.missingIngredientIds,
  );
  if (missingIngredientIds.length) {
    return { complete: false, missingIngredientIds: [...new Set(missingIngredientIds)].sort() };
  }
  return {
    complete: true,
    costCentimes: costs.reduce(
      (sum, cost) => sum + (cost.complete ? cost.costCentimes : 0),
      0,
    ),
  };
}

export function marginBasisPoints(priceCentimes: number, cost: CostResult) {
  integer(priceCentimes, 'Price');
  if (!cost.complete || priceCentimes === 0) return undefined;
  return numberFrom(
    roundedDivision(
      BigInt(priceCentimes - cost.costCentimes) * 10_000n,
      BigInt(priceCentimes),
    ),
    'Margin',
  );
}

export function occursInMonth(
  targetMonth: string,
  startMonth: string,
  endMonth?: string,
) {
  if (!/^\d{4}-\d{2}$/.test(targetMonth) || !/^\d{4}-\d{2}$/.test(startMonth)) {
    throw new Error('Months must use YYYY-MM.');
  }
  if (endMonth && !/^\d{4}-\d{2}$/.test(endMonth)) {
    throw new Error('Months must use YYYY-MM.');
  }
  return targetMonth >= startMonth && (!endMonth || targetMonth <= endMonth);
}
