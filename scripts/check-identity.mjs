import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isServiceUnavailable,
  nextOfflinePinResult,
} from '../src/data/identityPolicy.ts';
import { offlineCredentialKeys } from '../src/data/offlineCredentials.ts';

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

const firstProfileKeys = offlineCredentialKeys('staff-profile-a');
const secondProfileKeys = offlineCredentialKeys('staff-profile-b');
assert.notDeepEqual(firstProfileKeys, secondProfileKeys);
assert.equal(new Set(Object.values(firstProfileKeys)).size, 3);
assert.ok(Object.values(firstProfileKeys).every((key) => /^[A-Za-z0-9._-]{1,100}$/.test(key)));

const lockScreen = readFileSync('src/features/settings/LockScreen.tsx', 'utf8');
const app = readFileSync('src/App.tsx', 'utf8');
const sqliteSchema = readFileSync('src/data/schema.ts', 'utf8');
const settings = readFileSync('src/data/terminalSettings.ts', 'utf8');
const securePlugin = readFileSync('android/app/src/main/java/com/olaso/pos/SecureSessionPlugin.kt', 'utf8');
const secureSession = readFileSync('src/data/secureSession.ts', 'utf8');
const connectionContext = readFileSync('src/data/connectionContext.tsx', 'utf8');
const main = readFileSync('src/main.tsx', 'utf8');
const settingsScreen = readFileSync('src/features/settings/SettingsScreen.tsx', 'utf8');
const identity = readFileSync('convex/identityInternal.ts', 'utf8');
const identityAction = readFileSync('convex/identity.ts', 'utf8');
const sync = readFileSync('convex/sync.ts', 'utf8');
const sessionBoundary = readFileSync('convex/lib/session.ts', 'utf8');
const management = readFileSync('convex/lib/management.ts', 'utf8');
const operational = readFileSync('convex/lib/operational.ts', 'utf8');
const posData = readFileSync('src/data/usePosData.ts', 'utf8');
const reconnect = readFileSync('src/data/reconnectContext.tsx', 'utf8');
const identitySession = readFileSync('src/data/identitySession.ts', 'utf8');
const operationalCache = readFileSync('src/data/operationalCache.ts', 'utf8');
const ownerSessionCheck = readFileSync('scripts/owner-session.mjs', 'utf8');
const resetChecks = [
  'scripts/check-dashboard.mjs',
  'scripts/check-expenses.mjs',
  'scripts/check-inventory.mjs',
  'scripts/check-management.mjs',
  'scripts/check-monthly-costs.mjs',
  'scripts/check-reports.mjs',
  'scripts/check-staff.mjs',
].map((path) => readFileSync(path, 'utf8'));
assert.match(lockScreen, /if \(!isServiceUnavailable\(onlineError\)\)/);
assert.match(lockScreen, /Wrong PIN\. Try again\./);
assert.doesNotMatch(lockScreen, /setError\(\s*caught instanceof Error/);
assert.match(lockScreen, /saved\.name !== cached\.name \|\| saved\.role !== cached\.role/);
assert.match(lockScreen, /loadStaffSession\(staffProfileId\)/);
assert.match(lockScreen, /verifyOfflinePin\(staffProfileId, pin\)/);
assert.match(lockScreen, /saveAuthenticatedStaffProfile/);
assert.match(lockScreen, /reconcileAuthenticatedStaffProfiles/);
assert.ok(
  lockScreen.indexOf('await reconcileAuthenticatedStaffProfiles')
    > lockScreen.indexOf("if (session.kind !== 'authenticated')"),
);
assert.ok(
  lockScreen.lastIndexOf('await clearStaffSession')
    > lockScreen.indexOf("if (session.kind !== 'authenticated')"),
);
assert.ok(
  lockScreen.indexOf('await saveStaffSession(session, pin)')
    > lockScreen.lastIndexOf('await clearStaffSession'),
);
assert.match(lockScreen, /saved\.identityRevision !== cached\.identityRevision/);
assert.match(lockScreen, /await clearStaffSession\(staffProfileId\)/);
assert.doesNotMatch(lockScreen, /reconcileActiveStaffProfiles/);
assert.match(app, /startupError \|\| !terminal/);
assert.match(app, /POS remains locked/);
assert.match(app, /await setTerminalLocked\(true\)/);
assert.doesNotMatch(sqliteSchema + settings, /identity\.(?:session|offline_pin|offline_attempts)/);
assert.doesNotMatch(securePlugin, /Log\.|println|printStackTrace/);
assert.match(securePlugin, /NetworkCapabilities\.NET_CAPABILITY_VALIDATED/);
assert.match(securePlugin, /ConnectivityManager\.NetworkCallback/);
assert.match(securePlugin, /registerDefaultNetworkCallback/);
assert.match(securePlugin, /registerNetworkCallback/);
assert.match(securePlugin, /unregisterNetworkCallback/);
assert.match(securePlugin, /notifyListeners\(NETWORK_STATUS_CHANGED/);
assert.doesNotMatch(
  securePlugin.match(/private val networkCallback[\s\S]*?override fun load\(\)/)?.[0] ?? '',
  /getNetworkCapabilities/,
);
assert.match(secureSession, /readSecureSessionNetworkStatus/);
assert.match(secureSession, /watchSecureSessionNetworkStatus/);
assert.match(main, /<ConnectionProvider>/);
assert.match(connectionContext, /watchSecureSessionNetworkStatus\(update\)/);
assert.match(connectionContext, /visibilitychange/);
assert.match(connectionContext, /pageshow/);
assert.match(lockScreen, /useConnectionStatus\(\)/);
assert.match(settingsScreen, /useConnectionStatus\(\)/);
assert.doesNotMatch(lockScreen + settingsScreen, /navigator\.onLine/);
assert.match(lockScreen, /const networkAvailable = await readSecureSessionNetworkStatus\(\)/);
assert.match(identity, /tokenHash/);
assert.match(identity, /revokedAt/);
assert.match(identity, /session\.deviceId !== args\.deviceId/);
assert.match(identityAction, /export const validateSession/);
assert.match(identityAction, /export const checkSession/);
assert.match(identityAction, /identityRevision: record\.credentialVersion/);
assert.match(sync, /credentialVersion \?\? 0/);
assert.doesNotMatch(sync, /identityRevision: 0/);
assert.match(sessionBoundary, /session\.deviceId !== args\.deviceId/);
assert.match(sessionBoundary, /identity\.credentialVersion !== session\.credentialVersion/);
assert.doesNotMatch(management + operational, /OLASO_ALLOW_DEV/);
assert.match(reconnect, /sessionToken: session\.token/);
assert.match(posData, /reconnect\.run\('automatic'\)/);
assert.match(identitySession, /offlineCredentialKeys/);
assert.match(identitySession, /migrateLegacyStaffSession/);
assert.match(identitySession, /export async function clearLegacyStaffSession/);
assert.match(operationalCache, /export async function saveAuthenticatedStaffProfile/);
assert.match(operationalCache, /export async function reconcileAuthenticatedStaffProfiles/);
assert.match(operationalCache, /profiles\.some\(\(profile\) => profile\.id === authenticatedProfileId\)/);
assert.doesNotMatch(operationalCache, /export async function reconcileActiveStaffProfiles/);
assert.match(ownerSessionCheck, /export function requireOwnerTestPin/);
for (const resetCheck of resetChecks) {
  assert.ok(
    resetCheck.indexOf('requireOwnerTestPin()')
      < resetCheck.indexOf('npm run seed:dev'),
    'Protected test PIN readiness must be checked before a development reset.',
  );
}
console.log('Identity fallback, profile-scoped offline credentials, monotonic lockout, fail-closed startup, session revocation, and protected-storage checks passed.');
