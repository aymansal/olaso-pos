import type { Doc } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';
import { cancelMetric } from './cancelMetric';

/** Read-only preview: server-acknowledged corrections are never reversed twice. */
export async function pendingReportCorrections(
  ctx: QueryCtx,
  rows: Doc<'dailyMetrics'>[],
  deviceId: string,
  localSaleIds: string[] = [],
) {
  if (localSaleIds.length > 100 || localSaleIds.some((id) => !id || id.length > 120)) {
    throw new Error('Pending report corrections exceed their supported limit.');
  }
  const byDate = new Map(rows.map((row) => [row.businessDate, row]));
  const cancelledIds = new Set<string>();
  for (const localSaleId of new Set(localSaleIds)) {
    const sale = await ctx.db.query('sales')
      .withIndex('by_device_local_sale', (q) => q.eq('deviceId', deviceId).eq('localSaleId', localSaleId))
      .unique();
    if (!sale || sale.status !== 'completed') continue;
    const metric = byDate.get(sale.businessDate);
    if (!metric) continue;
    const [items, movements] = await Promise.all([
      ctx.db.query('saleItems').withIndex('by_sale', (q) => q.eq('saleId', sale._id)).take(51),
      ctx.db.query('stockMovements').withIndex('by_related_sale', (q) => q.eq('relatedSaleId', sale._id)).take(101),
    ]);
    if (items.length > 50 || movements.length > 100) {
      throw new Error('Saved correction history is incomplete.');
    }
    byDate.set(sale.businessDate, { ...metric, ...cancelMetric(metric, sale, items, movements) });
    cancelledIds.add(sale._id);
  }
  return { rows: rows.map((row) => byDate.get(row.businessDate)!), cancelledIds };
}
