import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pbkdf2Sync, randomBytes, randomInt } from 'node:crypto';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { ownerSession, requireOwnerTestPin } from './owner-session.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const url = env.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(url, 'VITE_CONVEX_URL is missing from .env.local');
const client = new ConvexHttpClient(url);
async function reset() {
  requireOwnerTestPin();
  execSync('npm run seed:dev', { cwd: root, stdio: 'pipe' });
  return ownerSession(client, root, 'staff-check-device');
}

const sessionArgs = await reset();
const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
const mutation = (reference, args) => client.mutation(reference, { ...sessionArgs, ...args });
const action = (reference, args) => client.action(reference, { ...sessionArgs, ...args });
const credential = (pin) => {
  const pinSalt = randomBytes(16);
  return {
    pinSalt: pinSalt.toString('base64'),
    pinHash: pbkdf2Sync(pin, pinSalt, 600_000, 32, 'sha256').toString('base64'),
  };
};
try {
  const initialPin = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const initialCredential = credential(initialPin);
  const provisioned = await action(api.identity.createStaff, {
    name: 'Offline staff check',
    role: 'cashier',
    ...initialCredential,
    clientMutationId: 'staff01-profile-create',
  });
  assert.equal((await client.action(api.identity.checkSession, {
    token: provisioned.token,
    deviceId: sessionArgs.deviceId,
  })).kind, 'valid');
  const provisionedRetry = await action(api.identity.createStaff, {
    name: 'Offline staff check',
    role: 'cashier',
    ...initialCredential,
    clientMutationId: 'staff01-profile-create',
  });
  assert.equal(provisionedRetry.id, provisioned.id);
  assert.equal(provisioned.identityRevision, 1);
  assert.equal((await client.action(api.identity.checkSession, {
    token: provisionedRetry.token,
    deviceId: sessionArgs.deviceId,
  })).kind, 'valid');
  const signedIn = await client.action(api.identity.signIn, {
    staffProfileId: provisioned.id,
    pin: initialPin,
    deviceId: sessionArgs.deviceId,
  });
  assert.equal(signedIn.kind, 'authenticated');
  const provisionedList = await query(api.staff.list, {});
  const safeProfile = provisionedList.find((row) => row.id === provisioned.id);
  assert(safeProfile);
  assert.equal(JSON.stringify(safeProfile).includes(initialPin), false);
  assert.equal('pinHash' in safeProfile, false);

  const retriedPin = initialPin === '111111' ? '222222' : '111111';
  const retriedCredential = credential(retriedPin);
  const changedRetry = await action(api.identity.createStaff, {
    name: 'Offline staff check',
    role: 'cashier',
    ...retriedCredential,
    clientMutationId: 'staff01-profile-create',
  });
  assert.equal(changedRetry.id, provisioned.id);
  assert.equal(changedRetry.identityRevision, 2);
  assert.deepEqual(await client.action(api.identity.signIn, {
    staffProfileId: provisioned.id,
    pin: initialPin,
    deviceId: sessionArgs.deviceId,
  }), { kind: 'invalid-pin' });
  const retriedSession = await client.action(api.identity.signIn, {
    staffProfileId: provisioned.id,
    pin: retriedPin,
    deviceId: sessionArgs.deviceId,
  });
  assert.equal(retriedSession.kind, 'authenticated');

  const lockedDeviceId = 'staff-check-locked-device';
  const wrongPin = retriedPin === '333333' ? '444444' : '333333';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const failure = await client.action(api.identity.signIn, {
      staffProfileId: provisioned.id,
      pin: wrongPin,
      deviceId: lockedDeviceId,
    });
    assert.equal(failure.kind, attempt === 4 ? 'locked' : 'invalid-pin');
  }
  const changedPin = retriedPin === '555555' ? '666666' : '555555';
  const updated = await action(api.identity.updateStaffPin, {
    staffProfileId: provisioned.id,
    ...credential(changedPin),
  });
  assert.equal(updated.identityRevision, 3);
  assert.equal((await client.action(api.identity.checkSession, {
    token: retriedSession.token,
    deviceId: sessionArgs.deviceId,
  })).kind, 'invalid');
  assert.deepEqual(await client.action(api.identity.signIn, {
    staffProfileId: provisioned.id,
    pin: retriedPin,
    deviceId: sessionArgs.deviceId,
  }), { kind: 'invalid-pin' });
  assert.equal((await client.action(api.identity.signIn, {
    staffProfileId: provisioned.id,
    pin: changedPin,
    deviceId: lockedDeviceId,
  })).kind, 'authenticated');

  const created = await mutation(api.staff.save, {
    name: 'Cost check cashier',
    role: 'cashier',
    clientMutationId: 'cost06-staff-create',
  });
  const retry = await mutation(api.staff.save, {
    name: 'Cost check cashier',
    role: 'cashier',
    clientMutationId: 'cost06-staff-create',
  });
  assert.equal(retry.id, created.id);
  const staff = await query(api.staff.list, {});
  const profile = staff.find((row) => row.id === created.id);
  assert(profile);
  assert.equal('monthlyAmountCentimes' in profile, false);
  const period = await mutation(api.staff.addCompensationPeriod, {
    staffProfileId: created.id,
    monthlyAmountCentimes: 550000,
    effectiveStartMonth: '2026-08',
    clientMutationId: 'cost06-period-create',
  });
  const periodRetry = await mutation(api.staff.addCompensationPeriod, {
    staffProfileId: created.id,
    monthlyAmountCentimes: 550000,
    effectiveStartMonth: '2026-08',
    clientMutationId: 'cost06-period-create',
  });
  assert.equal(periodRetry.id, period.id);
  await assert.rejects(
    mutation(api.staff.addCompensationPeriod, {
      staffProfileId: created.id,
      monthlyAmountCentimes: 600000,
      effectiveStartMonth: '2026-09',
      clientMutationId: 'cost06-period-overlap',
    }),
    /cannot overlap/,
  );
  const periods = await query(api.staff.listCompensation, {
    staffProfileId: created.id,
  });
  assert.deepEqual(periods.map((row) => row.monthlyAmountCentimes), [550000]);
} finally {
  await reset();
}

console.log('Staff and owner-only compensation checks passed.');
