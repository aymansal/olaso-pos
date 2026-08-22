import {
  readSecureSessionValue,
  removeSecureSessionValue,
  writeSecureSessionValue,
} from './secureSession';

const PIN_ITERATIONS = 600_000;
const SESSION_KEY = 'identity.session';
const OFFLINE_PIN_KEY = 'identity.offline_pin';

export type StaffSession = {
  token: string;
  staffProfileId: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier' | 'worker';
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
    && ['owner', 'manager', 'cashier', 'worker'].includes(String(session.role));
}

export async function saveStaffSession(session: StaffSession, pin: string) {
  if (!/^\d{6}$/.test(pin)) throw new Error('PIN must contain six digits.');
  const salt = toBase64(crypto.getRandomValues(new Uint8Array(16)));
  await Promise.all([
    writeSecureSessionValue(SESSION_KEY, JSON.stringify(session)),
    writeSecureSessionValue(OFFLINE_PIN_KEY, `${salt}:${await derivePinHash(pin, salt)}`),
  ]);
}

export async function loadStaffSession() {
  const raw = await readSecureSessionValue(SESSION_KEY);
  if (!raw) return undefined;
  const session: unknown = JSON.parse(raw);
  if (!isStaffSession(session)) throw new Error('Stored staff session is invalid.');
  return session;
}

export async function verifyOfflinePin(pin: string) {
  if (!/^\d{6}$/.test(pin)) return false;
  const stored = await readSecureSessionValue(OFFLINE_PIN_KEY);
  const [salt, expected] = stored?.split(':', 2) ?? [];
  return Boolean(salt && expected && equal(await derivePinHash(pin, salt), expected));
}

export async function clearStaffSession() {
  await Promise.all([
    removeSecureSessionValue(SESSION_KEY),
    removeSecureSessionValue(OFFLINE_PIN_KEY),
  ]);
}
