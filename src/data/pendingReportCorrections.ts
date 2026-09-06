import { openLocalDatabase } from './localDatabase.ts';

export async function pendingReportSaleIds() {
  const database = await openLocalDatabase();
  const rows = (await database.query(
    `SELECT original_local_sale_id FROM sale_corrections
     WHERE sync_state IN ('pending', 'failed') ORDER BY corrected_at LIMIT 101`,
  )).values ?? [];
  if (rows.length > 100) throw new Error('Pending report corrections exceed their supported limit.');
  return rows.map((row) => String(row.original_local_sale_id));
}
