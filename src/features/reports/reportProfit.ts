import { operatingCostsForRange } from '../../lib/costs.ts';
import type { SavedCostManagement } from '../../data/localCosts';
import type { ReportsSnapshot } from '../../data/useReportsData';

export function buildPeriodProfit(
  snapshot: ReportsSnapshot | undefined,
  costs: SavedCostManagement | undefined,
  fromDate: string,
  toDate: string,
  showCompensation: boolean,
) {
  const revenueCentimes = snapshot?.current.netCentimes ?? 0;
  const ingredientCostCentimes = snapshot?.current.ingredientCostCentimes ?? 0;
  const allocated = fromDate && toDate
    ? operatingCostsForRange(
      costs?.expenses ?? [],
      showCompensation ? costs?.compensation ?? [] : [],
      fromDate,
      toDate,
    )
    : { compensationCentimes: 0, otherExpenseCentimes: 0 };
  const grossProfitCentimes = revenueCentimes - ingredientCostCentimes;
  const incomplete = (snapshot?.current.incompleteSaleCount ?? 0) > 0;
  return {
    revenueCentimes,
    ingredientCostCentimes,
    grossProfitCentimes,
    compensationCentimes: allocated.compensationCentimes,
    otherExpenseCentimes: allocated.otherExpenseCentimes,
    operatingProfitCentimes: grossProfitCentimes
      - allocated.compensationCentimes
      - allocated.otherExpenseCentimes,
    complete: !incomplete,
  };
}
