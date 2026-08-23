import {
  readSecureSessionValue,
  readSecureSessionClock,
  removeSecureSessionValue,
  writeSecureSessionValue,
} from './secureSession';
import {
  isServiceUnavailable,
  nextOfflinePinResult,
  type OfflineAttempt,
  type OfflinePinResult,
} from './identityPolicy';
import { offlineCredentialKeys } from './offlineCredentials.ts';
import type { StaffRole } from '../../convex/lib/permissions';

export { isServiceUnavailable, nextOfflinePinResult } from './identityPolicy';

const PIN_ITERATIONS = 600_000;
const LEGACY_SESSION_KEY = 'identity.session';
const LEGACY_OFFLINE_PIN_KEY = 'identity.offline_pin';
const LEGACY_OFFLINE_ATTEMPTS_KEY = 'identity.offline_attempts';
const MAX_OFFLINE_FAILURES = 5;

export type StaffSession = {
  token: string;
  staffProfileId: string;
  name: string;
  role: StaffRole;
};


function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function derivePinHash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(salt), iterations: PIN_ITERATIONS },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

function equal(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function isStaffSession(value: unknown): value is StaffSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Record<string, unknown>;
  return typeof session.token === 'string'
    && typeof session.staffProfileId === 'string'
    && typeof session.name === 'string'
    && ['owner', 'manager', 'cashier'].includes(String(session.role));
}

async function migrateLegacyStaffSession(staffProfileId: string) {
  const raw = await readSecureSessionValue(LEGACY_SESSION_KEY);
  if (!raw) return;
  const session: unknown = JSON.parse(raw);
  if (!isStaffSession(session)) throw new Error('Stored staff session is invalid.');
  if (session.staffProfileId !== staffProfileId) return;
  const [pin, attempts] = await Promise.all([
    readSecureSessionValue(LEGACY_OFFLINE_PIN_KEY),
    readSecureSessionValue(LEGACY_OFFLINE_ATTEMPTS_KEY),
  ]);
  if (!pin) return;
  const keys = offlineCredentialKeys(staffProfileId);
  await Promise.all([
    writeSecureSessionValue(keys.session, raw),
    writeSecureSessionValue(keys.pin, pin),
    attempts
      ? writeSecureSessionValue(keys.attempts, attempts)
      : removeSecureSessionValue(keys.attempts),
  ]);
  await Promise.all([
    removeSecureSessionValue(LEGACY_SESSION_KEY),
    removeSecureSessionValue(LEGACY_OFFLINE_PIN_KEY),
    removeSecureSessionValue(LEGACY_OFFLINE_ATTEMPTS_KEY),
  ]);
}

export async function saveStaffSession(session: StaffSession, pin: string) {
  if (!/^\d{6}$/.test(pin)) throw new Error('PIN must contain six digits.');
  const salt = toBase64(crypto.getRandomValues(new Uint8Array(16)));
  const keys = offlineCredentialKeys(session.staffProfileId);
  await Promise.all([
    writeSecureSessionValue(keys.session, JSON.stringify(session)),
    writeSecureSessionValue(keys.pin, `${salt}:${await derivePinHash(pin, salt)}`),
    removeSecureSessionValue(keys.attempts),
  ]);
}

export async function loadStaffSession(staffProfileId: string) {
  const keys = offlineCredentialKeys(staffProfileId);
  let raw = await readSecureSessionValue(keys.session);
  if (!raw) {
    await migrateLegacyStaffSession(staffProfileId);
    raw = await readSecureSessionValue(keys.session);
  }
  if (!raw) return undefined;
  const session: unknown = JSON.parse(raw);
  if (!isStaffSession(session)) throw new Error('Stored staff session is invalid.');
  if (session.staffProfileId !== staffProfileId) {
    throw new Error('Stored staff session does not match this profile.');
  }
  return session;
}

function parseOfflineAttempt(value: string | null) {
  if (!value) return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error('Protected offline lockout state is invalid.');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Protected offline lockout state is invalid.');
  }
  const attempt = parsed as Record<string, unknown>;
  if (!Number.isInteger(attempt.failedCount) || Number(attempt.failedCount) < 0
      || !Number.isInteger(attempt.bootCount) || Number(attempt.bootCount) < 0
      || (attempt.lockedUntilElapsedRealtime !== undefined
        && (!Number.isInteger(attempt.lockedUntilElapsedRealtime)
          || Number(attempt.lockedUntilElapsedRealtime) < 0))) {
    throw new Error('Protected offline lockout state is invalid.');
  }
  return attempt as OfflineAttempt;
}

export async function verifyOfflinePin(
  staffProfileId: string,
  pin: string,
): Promise<OfflinePinResult> {
  if (!/^\d{6}$/.test(pin)) return { kind: 'incorrect', attemptsRemaining: MAX_OFFLINE_FAILURES };
  const keys = offlineCredentialKeys(staffProfileId);
  let stored = await readSecureSessionValue(keys.pin);
  if (!stored) {
    await migrateLegacyStaffSession(staffProfileId);
    stored = await readSecureSessionValue(keys.pin);
  }
  const [salt, expected] = stored?.split(':', 2) ?? [];
  if (!salt || !expected) {
    throw new Error('This profile must sign in online once before offline access is available.');
  }
  const [rawAttempt, clock] = await Promise.all([
    readSecureSessionValue(keys.attempts),
    readSecureSessionClock(),
  ]);
  const next = nextOfflinePinResult(
    parseOfflineAttempt(rawAttempt),
    equal(await derivePinHash(pin, salt), expected),
    clock,
  );
  if (next.attempt) {
    await writeSecureSessionValue(keys.attempts, JSON.stringify(next.attempt));
  } else {
    await removeSecureSessionValue(keys.attempts);
  }
  return next.result;
}

export async function clearStaffSession(staffProfileId: string) {
  const keys = offlineCredentialKeys(staffProfileId);
  await Promise.all([
    removeSecureSessionValue(keys.session),
    removeSecureSessionValue(keys.pin),
    removeSecureSessionValue(keys.attempts),
  ]);
}

export async function clearLegacyStaffSession() {
  await Promise.all([
    removeSecureSessionValue(LEGACY_SESSION_KEY),
    removeSecureSessionValue(LEGACY_OFFLINE_PIN_KEY),
    removeSecureSessionValue(LEGACY_OFFLINE_ATTEMPTS_KEY),
  ]);
}
