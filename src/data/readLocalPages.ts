import type { SQLiteDBConnection } from '@capacitor-community/sqlite';

/** Configuration/aggregate lists are complete, with bounded bridge responses. */
export async function readLocalPages(
  database: Pick<SQLiteDBConnection, 'query'>,
  orderedSql: string,
  values: unknown[] = [],
) {
  const rows: Record<string, unknown>[] = [];
  for (let offset = 0; ; offset += 100) {
    const page = (await database.query(`${orderedSql} LIMIT 100 OFFSET ?`, [...values, offset])).values ?? [];
    rows.push(...page);
    if (page.length < 100) return { values: rows };
  }
}
