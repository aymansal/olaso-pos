import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { withLocalTransaction } from './localDatabase.ts';

export type ClockFormat = '12-hour' | '24-hour';

export type TerminalSettings = {
  deviceId: string;
  terminalName: string;
  clockFormat: ClockFormat;
  isLocked: boolean;
  pendingSyncCount: number;
  lastSyncAt?: number;
  lastSyncError?: string;
  menuUpdatedAt?: number;
};

export type TerminalPreferences = Pick<
  TerminalSettings,
  'terminalName' | 'clockFormat'
>;

type SettingsDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

const DEFAULT_TERMINAL_NAME = 'Olaso POS';

function cleanTerminalName(value: string) {
  const terminalName = value.trim().replace(/\s+/g, ' ');
  if (!terminalName || terminalName.length > 40) {
    throw new Error('Terminal name must contain 1 to 40 characters.');
  }
  return terminalName;
}

function assertClockFormat(value: string): asserts value is ClockFormat {
  if (value !== '12-hour' && value !== '24-hour') {
    throw new Error('Clock format must be 12-hour or 24-hour.');
  }
}

async function upsertSetting(
  database: SettingsDatabase,
  key: string,
  value: string,
  updatedAt: number,
) {
  await database.run(
    `INSERT INTO device_settings (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = excluded.updated_at`,
    [key, value, updatedAt],
    false,
  );
}

export async function loadTerminalSettingsFromDatabase(
  database: SettingsDatabase,
  idFactory = () => crypto.randomUUID(),
  now = Date.now(),
): Promise<TerminalSettings> {
  const settings = await database.query(
    `SELECT key, value
     FROM device_settings
     WHERE key IN (
       'device_id',
       'terminal_name',
       'clock_format',
       'session_locked',
       'operational_cache_updated_at'
     )
     LIMIT 5`,
  );
  const values = new Map(
    (settings.values ?? []).map((row) => [String(row.key), String(row.value)]),
  );
  const deviceId = values.get('device_id') ?? `device-${idFactory()}`;
  const terminalName = values.get('terminal_name') ?? DEFAULT_TERMINAL_NAME;
  const clockFormat = values.get('clock_format') ?? '24-hour';
  assertClockFormat(clockFormat);

  for (const [key, value] of [
    ['device_id', deviceId],
    ['terminal_name', terminalName],
    ['clock_format', clockFormat],
    ['session_locked', values.get('session_locked') ?? '0'],
  ]) {
    if (!values.has(key)) await upsertSetting(database, key, value, now);
  }

  const [syncState, pending] = await Promise.all([
    database.query(
      `SELECT last_success_at, last_error
       FROM sync_state
       WHERE id = 1
       LIMIT 1`,
    ),
    database.query('SELECT COUNT(*) AS count FROM outbox'),
  ]);
  const sync = syncState.values?.[0];
  const menuUpdatedAt = Number(
    values.get('operational_cache_updated_at') ?? 0,
  );

  return {
    deviceId,
    terminalName: cleanTerminalName(terminalName),
    clockFormat,
    isLocked: values.get('session_locked') === '1',
    pendingSyncCount: Number(pending.values?.[0]?.count ?? 0),
    ...(sync?.last_success_at
      ? { lastSyncAt: Number(sync.last_success_at) }
      : {}),
    ...(sync?.last_error ? { lastSyncError: String(sync.last_error) } : {}),
    ...(menuUpdatedAt > 0 ? { menuUpdatedAt } : {}),
  };
}

export function loadTerminalSettings() {
  return withLocalTransaction((database) =>
    loadTerminalSettingsFromDatabase(database),
  );
}

export async function saveTerminalPreferencesToDatabase(
  database: SettingsDatabase,
  input: TerminalPreferences,
  now = Date.now(),
) {
  const terminalName = cleanTerminalName(input.terminalName);
  assertClockFormat(input.clockFormat);
  await upsertSetting(database, 'terminal_name', terminalName, now);
  await upsertSetting(database, 'clock_format', input.clockFormat, now);
  return { terminalName, clockFormat: input.clockFormat };
}

export function saveTerminalPreferences(input: TerminalPreferences) {
  return withLocalTransaction((database) =>
    saveTerminalPreferencesToDatabase(database, input),
  );
}

export function setTerminalLockedInDatabase(
  database: SettingsDatabase,
  isLocked: boolean,
  now = Date.now(),
) {
  return upsertSetting(
    database,
    'session_locked',
    isLocked ? '1' : '0',
    now,
  );
}

export function setTerminalLocked(isLocked: boolean) {
  return withLocalTransaction((database) =>
    setTerminalLockedInDatabase(database, isLocked),
  );
}

export function describeSyncFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/unauthenticated|sign-in is required/i.test(message)) {
    return 'Synchronization access is unavailable. Restore terminal access and try again.';
  }
  if (/network|failed to fetch|offline/i.test(message)) {
    return 'Cloud connection failed. Check the connection and try again.';
  }
  return 'Synchronization failed. Try again.';
}

export function recordSyncFailure(error: unknown) {
  const message = describeSyncFailure(error);
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sync_state
       SET last_error = ?
       WHERE id = 1`,
      [message],
      false,
    );
    return message;
  });
}
