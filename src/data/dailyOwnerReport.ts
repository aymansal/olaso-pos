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
  const [sales, corrections, items] = await Promise.all([
    database.query(
      `SELECT local_sale_id, actor_profile_id, status, service_type, total_centimes,
        receipt_snapshot_json, subtotal_centimes,
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
    database.query(
      `SELECT item.local_sale_id, item.product_name_snapshot,
        SUM(item.quantity) AS quantity, SUM(item.line_total_centimes) AS total_centimes
       FROM sale_items item
       JOIN sales sale ON sale.local_sale_id = item.local_sale_id
       WHERE sale.business_date = ? AND sale.status = 'completed'
       GROUP BY item.local_sale_id, item.product_name_snapshot
       ORDER BY item.local_sale_id, item.product_name_snapshot
       LIMIT 5001`,
      [businessDate],
    ),
  ]);
  if (
    (sales.values?.length ?? 0) > 1_000
    || (corrections.values?.length ?? 0) > 100
    || (items.values?.length ?? 0) > 5_000
  ) {
    throw new Error('The saved daily report exceeds its supported limit.');
  }
  const productsBySale = new Map<string, Array<{ name: string; quantity: number; totalCentimes: number }>>();
  for (const row of items.values ?? []) {
    const saleId = String(row.local_sale_id);
    const products = productsBySale.get(saleId) ?? [];
    products.push({
      name: String(row.product_name_snapshot),
      quantity: Number(row.quantity),
      totalCentimes: Number(row.total_centimes),
    });
    productsBySale.set(saleId, products);
  }
  const profiles = new Map<string, {
    name?: string;
    orderCount: number;
    itemCount: number;
    netCentimes: number;
    products: Map<string, { name: string; quantity: number; totalCentimes: number }>;
  }>();
  for (const row of sales.values ?? []) {
    if (row.status !== 'completed') continue;
    const profileId = row.actor_profile_id ? String(row.actor_profile_id) : '';
    let cashierName: string | undefined;
    try {
      const saved = JSON.parse(String(row.receipt_snapshot_json)) as { cashierName?: unknown };
      cashierName = typeof saved.cashierName === 'string' && saved.cashierName.trim()
        ? saved.cashierName.trim()
        : undefined;
    } catch {
      cashierName = undefined;
    }
    const profile = profiles.get(profileId) ?? {
      ...(profileId && cashierName ? { name: cashierName } : {}),
      orderCount: 0,
      itemCount: 0,
      netCentimes: 0,
      products: new Map(),
    };
    profile.orderCount += 1;
    profile.netCentimes += Number(row.total_centimes);
    for (const product of productsBySale.get(String(row.local_sale_id)) ?? []) {
      const total = profile.products.get(product.name) ?? { ...product, quantity: 0, totalCentimes: 0 };
      total.quantity += product.quantity;
      total.totalCentimes += product.totalCentimes;
      profile.itemCount += product.quantity;
      profile.products.set(product.name, total);
    }
    profiles.set(profileId, profile);
  }
  return {
    salesRows: sales.values ?? [],
    profileTotals: [...profiles.values()]
      .map((profile) => ({
        ...(profile.name ? { name: profile.name } : {}),
        orderCount: profile.orderCount,
        itemCount: profile.itemCount,
        netCentimes: profile.netCentimes,
        products: [...profile.products.values()].sort((left, right) =>
          right.totalCentimes - left.totalCentimes || left.name.localeCompare(right.name),
        ),
      }))
      .sort((left, right) => right.netCentimes - left.netCentimes || (left.name ?? '').localeCompare(right.name ?? '')),
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
    profilePerformance: overview.profileTotals,
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
