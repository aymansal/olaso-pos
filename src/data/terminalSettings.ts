import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { withLocalTransaction } from './localDatabase.ts';

export type ClockFormat = '12-hour' | '24-hour';
export type ReceiptLanguage = 'en' | 'fr';
export type ApplicationLanguage = 'en' | 'fr';
export type AutoLockMinutes = 0 | 5 | 10 | 15 | 30;

export type TerminalSettings = {
  deviceId: string;
  terminalName: string;
  clockFormat: ClockFormat;
  receiptLanguage: ReceiptLanguage;
  applicationLanguage: ApplicationLanguage;
  autoLockMinutes: AutoLockMinutes;
  isLocked: boolean;
  pendingSyncCount: number;
  lastSyncAt?: number;
  lastSyncError?: string;
  menuUpdatedAt?: number;
  printerHost: string;
  printerPort: number;
};

export type TerminalPreferences = Pick<
  TerminalSettings,
  'terminalName' | 'clockFormat' | 'receiptLanguage' | 'applicationLanguage'
> & { autoLockMinutes?: AutoLockMinutes };

export type PrinterPreferences = Pick<
  TerminalSettings,
  'printerHost' | 'printerPort'
>;

type SettingsDatabase = Pick<SQLiteDBConnection, 'query' | 'run'>;

const DEFAULT_TERMINAL_NAME = 'Olaso POS';
const DEFAULT_PRINTER_PORT = 9100;

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

function assertReceiptLanguage(value: string): asserts value is ReceiptLanguage {
  if (value !== 'en' && value !== 'fr') {
    throw new Error('Receipt language must be English or French.');
  }
}

function assertApplicationLanguage(
  value: string,
): asserts value is ApplicationLanguage {
  if (value !== 'en' && value !== 'fr') {
    throw new Error('Application language must be English or French.');
  }
}

function isValidIpv4(value: string) {
  const parts = value.split('.');
  return parts.length === 4 && parts.every((part) => {
    const octet = Number(part);
    return /^\d{1,3}$/.test(part) && octet >= 0 && octet <= 255;
  });
}

export function validatePrinterPreferences(
  input: PrinterPreferences,
): PrinterPreferences {
  const printerHost = input.printerHost.trim();
  if (!isValidIpv4(printerHost)) {
    throw new Error('Printer address must be a valid IPv4 address.');
  }
  if (!Number.isInteger(input.printerPort)
      || input.printerPort < 1
      || input.printerPort > 65535) {
    throw new Error('Printer port must be from 1 to 65535.');
  }
  return { printerHost, printerPort: input.printerPort };
}

export function parsePrinterEndpoint(value: string): PrinterPreferences {
  const trimmed = value.trim();
  const separator = trimmed.lastIndexOf(':');
  if (separator === -1) {
    return validatePrinterPreferences({
      printerHost: trimmed,
      printerPort: DEFAULT_PRINTER_PORT,
    });
  }
  return validatePrinterPreferences({
    printerHost: trimmed.slice(0, separator),
    printerPort: Number(trimmed.slice(separator + 1)),
  });
}

export function formatPrinterEndpoint(host: string, port: number) {
  return host ? `${host}:${port}` : '';
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
       'receipt_language',
       'application_language',
       'auto_lock_minutes',
       'session_locked',
       'operational_cache_updated_at',
       'printer_host',
       'printer_port'
     )
     LIMIT 10`,
  );
  const values = new Map(
    (settings.values ?? []).map((row) => [String(row.key), String(row.value)]),
  );
  const deviceId = values.get('device_id') ?? `device-${idFactory()}`;
  const terminalName = values.get('terminal_name') ?? DEFAULT_TERMINAL_NAME;
  const clockFormat = values.get('clock_format') ?? '24-hour';
  const receiptLanguage = values.get('receipt_language') ?? 'en';
  const applicationLanguage = values.get('application_language') ?? 'en';
  const storedAutoLock = values.get('auto_lock_minutes') ?? '5';
  const autoLockMinutes = (['0', '5', '10', '15', '30'].includes(storedAutoLock)
    ? Number(storedAutoLock) : 5) as AutoLockMinutes;
  assertClockFormat(clockFormat);
  assertReceiptLanguage(receiptLanguage);
  assertApplicationLanguage(applicationLanguage);

  for (const [key, value] of [
    ['device_id', deviceId],
    ['terminal_name', terminalName],
    ['clock_format', clockFormat],
    ['receipt_language', receiptLanguage],
    ['application_language', applicationLanguage],
    ['auto_lock_minutes', String(autoLockMinutes)],
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
    database.query(
      `SELECT COUNT(*) AS count FROM outbox
       WHERE operation_type IN ('sale-completed', 'sale-cancelled')`,
    ),
  ]);
  const sync = syncState.values?.[0];
  const menuUpdatedAt = Number(
    values.get('operational_cache_updated_at') ?? 0,
  );
  const storedPrinterPort = Number(
    values.get('printer_port') ?? DEFAULT_PRINTER_PORT,
  );

  return {
    deviceId,
    terminalName: cleanTerminalName(terminalName),
    clockFormat,
    receiptLanguage,
    applicationLanguage,
    autoLockMinutes,
    isLocked: values.get('session_locked') === '1',
    pendingSyncCount: Number(pending.values?.[0]?.count ?? 0),
    printerHost: values.get('printer_host') ?? '',
    printerPort: Number.isInteger(storedPrinterPort)
        && storedPrinterPort >= 1
        && storedPrinterPort <= 65535
      ? storedPrinterPort
      : 0,
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
  assertReceiptLanguage(input.receiptLanguage);
  assertApplicationLanguage(input.applicationLanguage);
  if (input.autoLockMinutes !== undefined && ![0, 5, 10, 15, 30].includes(input.autoLockMinutes)) {
    throw new Error('Auto-lock duration is invalid.');
  }
  await upsertSetting(database, 'terminal_name', terminalName, now);
  await upsertSetting(database, 'clock_format', input.clockFormat, now);
  await upsertSetting(database, 'receipt_language', input.receiptLanguage, now);
  if (input.autoLockMinutes !== undefined) {
    await upsertSetting(database, 'auto_lock_minutes', String(input.autoLockMinutes), now);
  }
  await upsertSetting(
    database,
    'application_language',
    input.applicationLanguage,
    now,
  );
  return {
    terminalName,
    clockFormat: input.clockFormat,
    receiptLanguage: input.receiptLanguage,
    applicationLanguage: input.applicationLanguage,
    ...(input.autoLockMinutes !== undefined ? { autoLockMinutes: input.autoLockMinutes } : {}),
  };
}

export function saveTerminalPreferences(input: TerminalPreferences) {
  return withLocalTransaction((database) =>
    saveTerminalPreferencesToDatabase(database, input),
  );
}

export async function savePrinterPreferencesToDatabase(
  database: SettingsDatabase,
  input: PrinterPreferences,
  now = Date.now(),
) {
  const printer = validatePrinterPreferences(input);
  await upsertSetting(database, 'printer_host', printer.printerHost, now);
  await upsertSetting(database, 'printer_port', String(printer.printerPort), now);
  return printer;
}

export function savePrinterPreferences(input: PrinterPreferences) {
  return withLocalTransaction((database) =>
    savePrinterPreferencesToDatabase(database, input),
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
  if (/unauthenticated|sign-in is required|session is unavailable/i.test(message)) {
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

export function clearSyncError() {
  return withLocalTransaction(async (database) => {
    await database.run(
      `UPDATE sync_state SET last_error = NULL WHERE id = 1`,
      [],
      false,
    );
  });
}
