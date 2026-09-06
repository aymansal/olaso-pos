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
  integer(current.quantity, 'Current quantity', Number.MIN_SAFE_INTEGER);
  integer(receivedQuantity, 'Received quantity', 1);
  integer(receivedCostCentimes, 'Received cost');
  const quantity = current.quantity + receivedQuantity;
  integer(quantity, 'Resulting quantity', Number.MIN_SAFE_INTEGER);
  // A negative balance means unrecorded stock was consumed. Receiving repairs
  // the count, but cannot establish the value of that missing historical stock.
  if (current.quantity < 0) {
    return quantity === 0
      ? { quantity: 0, inventoryValueCentimes: 0, complete: true }
      : { quantity, complete: false };
  }
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

export function valueStockIncrease(current: InventoryValuation, quantity: number) {
  integer(current.quantity, 'Current quantity', 1);
  integer(quantity, 'Added quantity', 1);
  if (!current.complete || current.inventoryValueCentimes === undefined) {
    throw new Error('Stock value is unavailable.');
  }
  integer(current.inventoryValueCentimes, 'Current inventory value');
  return numberFrom(roundedDivision(
    BigInt(current.inventoryValueCentimes) * BigInt(quantity),
    BigInt(current.quantity),
  ), 'Added stock value');
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

export function daysInCalendarMonth(month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error('Months must use YYYY-MM.');
  }
  const [year, calendarMonth] = month.split('-').map(Number);
  return new Date(Date.UTC(year, calendarMonth, 0)).getUTCDate();
}

export function monthsInDateRange(fromDate: string, toDate: string) {
  if (fromDate > toDate) throw new Error('Date range is invalid.');
  const months: string[] = [];
  let cursor = fromDate.slice(0, 7);
  const last = toDate.slice(0, 7);
  while (cursor <= last) {
    months.push(cursor);
    const [year, calendarMonth] = cursor.split('-').map(Number);
    cursor = calendarMonth === 12
      ? `${year + 1}-01`
      : `${year}-${String(calendarMonth + 1).padStart(2, '0')}`;
  }
  return months;
}

export function overlappingDaysInMonth(
  month: string,
  fromDate: string,
  toDate: string,
) {
  const lastDay = String(daysInCalendarMonth(month)).padStart(2, '0');
  const start = fromDate > `${month}-01` ? fromDate : `${month}-01`;
  const end = toDate < `${month}-${lastDay}` ? toDate : `${month}-${lastDay}`;
  if (start > end) return 0;
  return Math.floor(
    (Date.parse(`${end}T00:00:00.000Z`) - Date.parse(`${start}T00:00:00.000Z`))
      / 86_400_000,
  ) + 1;
}

export function allocateMonthlyAmountForRange(
  monthlyAmountCentimes: number,
  month: string,
  fromDate: string,
  toDate: string,
) {
  const overlap = overlappingDaysInMonth(month, fromDate, toDate);
  if (overlap === 0) return 0;
  return allocateCentimes(
    monthlyAmountCentimes,
    daysInCalendarMonth(month),
    overlap,
  );
}

export function operatingCostsForRange(
  expenses: Array<{
    amountCentimes: number;
    recurrence: 'one-time' | 'monthly';
    transactionType?: 'recorded' | 'reversal';
    effectiveDate?: string;
    effectiveStartMonth?: string;
    effectiveEndMonth?: string;
    effectiveStartDate?: string;
    effectiveEndDate?: string;
  }>,
  compensation: Array<{
    monthlyAmountCentimes: number;
    effectiveStartMonth: string;
    effectiveEndMonth?: string;
    effectiveStartDate?: string;
    effectiveEndDate?: string;
  }>,
  fromDate: string,
  toDate: string,
) {
  const sign = (type?: 'recorded' | 'reversal') =>
    type === 'reversal' ? -1 : 1;
  let otherExpenseCentimes = expenses.reduce((sum, expense) => {
    if (expense.recurrence === 'one-time') {
      const date = expense.effectiveDate;
      return date && date >= fromDate && date <= toDate
        ? sum + sign(expense.transactionType) * expense.amountCentimes
        : sum;
    }
    return sum;
  }, 0);
  let compensationCentimes = 0;
  for (const month of monthsInDateRange(fromDate, toDate)) {
    const monthStart = `${month}-01`;
    const monthEnd = `${month}-${String(daysInCalendarMonth(month)).padStart(2, '0')}`;
    for (const expense of expenses) {
      if (expense.recurrence !== 'monthly' || !expense.effectiveStartMonth) {
        continue;
      }
      if (!occursInMonth(month, expense.effectiveStartMonth, expense.effectiveEndMonth)) {
        continue;
      }
      const activeFrom = [fromDate, monthStart, expense.effectiveStartDate ?? monthStart]
        .sort().at(-1)!;
      const activeTo = [toDate, monthEnd, expense.effectiveEndDate ?? monthEnd]
        .sort()[0];
      if (activeFrom > activeTo) continue;
      otherExpenseCentimes += sign(expense.transactionType)
        * allocateMonthlyAmountForRange(
          expense.amountCentimes,
          month,
          activeFrom,
          activeTo,
        );
    }
    for (const period of compensation) {
      if (!occursInMonth(month, period.effectiveStartMonth, period.effectiveEndMonth)) {
        continue;
      }
      const activeFrom = [fromDate, monthStart, period.effectiveStartDate ?? monthStart]
        .sort().at(-1)!;
      const activeTo = [toDate, monthEnd, period.effectiveEndDate ?? monthEnd]
        .sort()[0];
      if (activeFrom > activeTo) continue;
      compensationCentimes += allocateMonthlyAmountForRange(
        period.monthlyAmountCentimes,
        month,
        activeFrom,
        activeTo,
      );
    }
  }
  return { otherExpenseCentimes, compensationCentimes };
}
