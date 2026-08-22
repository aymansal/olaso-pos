import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isServiceUnavailable,
  nextOfflinePinResult,
} from '../src/data/identityPolicy.ts';

const clock = { elapsedRealtime: 10_000, bootCount: 4 };
let attempt;
for (let count = 0; count < 4; count += 1) {
  ({ attempt } = nextOfflinePinResult(attempt, false, clock));
}
assert.deepEqual(nextOfflinePinResult(attempt, false, clock).result, { kind: 'locked' });
const locked = nextOfflinePinResult(attempt, false, clock).attempt;
assert.deepEqual(nextOfflinePinResult(locked, true, { ...clock, elapsedRealtime: 309_999 }).result, { kind: 'locked' });
assert.deepEqual(nextOfflinePinResult(locked, true, { ...clock, elapsedRealtime: 310_000 }).result, { kind: 'verified' });
assert.deepEqual(nextOfflinePinResult(locked, true, { elapsedRealtime: 1, bootCount: 5 }).result, { kind: 'locked' });

assert.equal(isServiceUnavailable(new TypeError('network failed')), true);
assert.equal(isServiceUnavailable(new Error('Failed to fetch')), true);
for (const rejection of ['PIN is incorrect.', 'Too many failed PIN attempts. Try again later.', 'Staff access is unavailable.', 'Sign-in details are invalid.']) {
  assert.equal(isServiceUnavailable(new Error(rejection)), false);
}

const lockScreen = readFileSync('src/features/settings/LockScreen.tsx', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');
const sqliteSchema = readFileSync('src/data/schema.ts', 'utf8');
const settings = readFileSync('src/data/terminalSettings.ts', 'utf8');
const securePlugin = readFileSync('android/app/src/main/java/com/olaso/pos/SecureSessionPlugin.kt', 'utf8');
const secureSession = readFileSync('src/data/secureSession.ts', 'utf8');
const identity = readFileSync('convex/identityInternal.ts', 'utf8');
const identityAction = readFileSync('convex/identity.ts', 'utf8');
const sessionBoundary = readFileSync('convex/lib/session.ts', 'utf8');
const management = readFileSync('convex/lib/management.ts', 'utf8');
const operational = readFileSync('convex/lib/operational.ts', 'utf8');
const posData = readFileSync('src/data/usePosData.ts', 'utf8');
assert.match(lockScreen, /if \(!isServiceUnavailable\(onlineError\)\)/);
assert.match(lockScreen, /Wrong PIN\. Try again\./);
assert.doesNotMatch(lockScreen, /setError\(\s*caught instanceof Error/);
assert.match(lockScreen, /saved\.name !== cached\.name \|\| saved\.role !== cached\.role/);
assert.match(lockScreen, /member\.id === session\?\.staffProfileId/);
assert.match(app, /startupError \|\| !terminal/);
assert.match(app, /POS remains locked/);
assert.match(app, /await setTerminalLocked\(true\)/);
assert.doesNotMatch(sqliteSchema + settings, /identity\.(?:session|offline_pin|offline_attempts)/);
assert.doesNotMatch(securePlugin, /Log\.|println|printStackTrace/);
assert.match(securePlugin, /NetworkCapabilities\.NET_CAPABILITY_VALIDATED/);
assert.match(secureSession, /readSecureSessionNetworkStatus/);
assert.match(lockScreen, /const networkAvailable = await readSecureSessionNetworkStatus\(\)/);
assert.match(identity, /tokenHash/);
assert.match(identity, /revokedAt/);
assert.match(identity, /session\.deviceId !== args\.deviceId/);
assert.match(identityAction, /export const validateSession/);
assert.match(sessionBoundary, /session\.deviceId !== args\.deviceId/);
assert.match(sessionBoundary, /identity\.credentialVersion !== session\.credentialVersion/);
assert.doesNotMatch(management + operational, /OLASO_ALLOW_DEV/);
assert.match(posData, /sessionToken: session\.token/);
console.log('Identity fallback, monotonic lockout, fail-closed startup, session revocation, and protected-storage checks passed.');
