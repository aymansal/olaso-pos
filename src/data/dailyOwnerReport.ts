import { operatingCostsForRange } from '../lib/costs.ts';
import { localBusinessDate } from '../lib/date.ts';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import {
  encodeDailyOwnerReport,
  type DailyOwnerReport,
} from '../printing/dailyReportEncoder.ts';
import { writePrinterBytes } from '../printing/printerTransport.ts';
import { describePrinterFailure } from '../printing/testPrinter.ts';
import { openLocalDatabase } from './localDatabase.ts';
import { loadLocalCostManagement } from './localCostViews.ts';
import { loadOfflineInventory, loadOfflineReport } from './offlineViews.ts';
import {
  loadTerminalSettings,
  validatePrinterPreferences,
} from './terminalSettings.ts';

type ReportDatabase = Pick<SQLiteDBConnection, 'query'>;

export async function loadDailySalesOverview(
  database: ReportDatabase,
  businessDate: string,
) {
  const [sales, corrections] = await Promise.all([
    database.query(
      `SELECT status, service_type, subtotal_centimes,
        cost_status, print_state FROM sales
       WHERE business_date = ? LIMIT 1001`,
      [businessDate],
    ),
    database.query(
      `SELECT sale.receipt_number, correction.reason, correction.actor_name
       FROM sale_corrections correction
       JOIN sales sale ON sale.local_sale_id = correction.original_local_sale_id
       WHERE correction.business_date = ?
       ORDER BY correction.corrected_at LIMIT 101`,
      [businessDate],
    ),
  ]);
  if ((sales.values?.length ?? 0) > 1_000 || (corrections.values?.length ?? 0) > 100) {
    throw new Error('The saved daily report exceeds its supported limit.');
  }
  return {
    salesRows: sales.values ?? [],
    cancellations: (corrections.values ?? []).map((row) => ({
      receiptNumber: String(row.receipt_number),
      reason: String(row.reason),
      actorName: String(row.actor_name),
    })),
  };
}

export async function createDailyOwnerReport(
  ownerName: string,
  printedAt = Date.now(),
): Promise<DailyOwnerReport> {
  const businessDate = localBusinessDate(new Date(printedAt));
  const database = await openLocalDatabase();
  const [report, costs, inventory, settings, overview] = await Promise.all([
    loadOfflineReport(businessDate, businessDate),
    loadLocalCostManagement(businessDate.slice(0, 7), 'owner'),
    loadOfflineInventory(),
    loadTerminalSettings(),
    loadDailySalesOverview(database, businessDate),
  ]);
  const completed = overview.salesRows.filter((row) => row.status === 'completed');
  const subtotalCentimes = completed.reduce((sum, row) => sum + Number(row.subtotal_centimes), 0);
  const offertCentimes = subtotalCentimes - report.current.netCentimes;
  const services = new Map<'dine-in' | 'take-away' | 'online', number>();
  for (const row of completed) {
    const service = row.service_type === 'dine-in' || row.service_type === 'take-away'
      ? row.service_type
      : 'online';
    services.set(service, (services.get(service) ?? 0) + 1);
  }
  const { compensationCentimes, otherExpenseCentimes } = operatingCostsForRange(
    costs.expenses,
    costs.compensation,
    businessDate,
    businessDate,
  );
  const ingredientCostCentimes = report.current.ingredientCostCentimes;
  const grossProfitCentimes = report.current.netCentimes - ingredientCostCentimes;
  return {
    language: settings.receiptLanguage,
    businessDate,
    printedAt,
    ownerName,
    orderCount: report.current.orderCount,
    itemCount: report.current.itemCount,
    subtotalCentimes,
    offertCentimes,
    netCentimes: report.current.netCentimes,
    averageCentimes: report.current.orderCount
      ? Math.round(report.current.netCentimes / report.current.orderCount)
      : 0,
    paymentTotals: report.current.paymentTotals.map((payment) => ({
      label: payment.paymentMethod,
      totalCentimes: payment.totalCentimes,
      orderCount: payment.orderCount,
    })),
    serviceTotals: [...services].map(([service, orderCount]) => ({ service, orderCount })),
    cancellations: overview.cancellations,
    products: report.current.productTotals.map((product) => ({
      name: product.productName,
      quantity: product.quantity,
      totalCentimes: product.totalCentimes,
    })),
    ingredientCostCentimes,
    grossProfitCentimes,
    compensationCentimes,
    expenseCentimes: otherExpenseCentimes,
    operatingProfitCentimes: grossProfitCentimes - compensationCentimes - otherExpenseCentimes,
    incompleteCostCount: completed.filter((row) => row.cost_status !== 'complete').length,
    inventoryValueCentimes: inventory.ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.inventoryValueCentimes ?? 0),
      0,
    ),
    lowStockCount: inventory.metrics.lowStockCount,
    pendingSyncCount: settings.pendingSyncCount,
    failedPrintCount: completed.filter((row) => row.print_state === 'failed').length,
  };
}

export async function printDailyOwnerReport(ownerName: string) {
  try {
    const [report, settings] = await Promise.all([
      createDailyOwnerReport(ownerName),
      loadTerminalSettings(),
    ]);
    const printer = validatePrinterPreferences(settings);
    await writePrinterBytes({
      host: printer.printerHost,
      port: printer.printerPort,
      bytes: encodeDailyOwnerReport(report),
    });
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: describePrinterFailure(error) };
  }
}
