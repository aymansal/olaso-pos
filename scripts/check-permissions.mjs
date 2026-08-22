import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { randomInt } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const url = env.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(url, 'VITE_CONVEX_URL is missing from .env.local');

function cli(...args) {
  return execSync(`npx ${args.join(' ')}`, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function secret() {
  return cli('convex', 'env', 'get', 'OLASO_SUPPORT_RECOVERY_CODE').trim();
}

async function expectForbidden(operation) {
  await assert.rejects(operation, /FORBIDDEN|UNAUTHENTICATED|cannot perform/i);
}

const client = new ConvexHttpClient(url);
const deviceId = 'perm-check-tablet';
const ownerPin = process.env.OLASO_OWNER_PIN;
assert(/^\d{6}$/.test(ownerPin ?? ''), 'OLASO_OWNER_PIN must be a six-digit test restore PIN');
const pin = () => String(randomInt(0, 1_000_000)).padStart(6, '0');
const checkId = `perm-check-${Date.now()}`;

async function ownerProfileId() {
  return JSON.parse(cli('convex', 'run', 'seed:verify'));
}

const temporaryProfiles = [];
let ownerArgs;
try {
  const seeded = await ownerProfileId();
  const ownerId = seeded.ownerProfileId;
  assert(ownerId, 'Development seed did not return an owner profile ID');
  const firstOwner = await client.action(api.identity.signIn, {
    staffProfileId: ownerId,
    pin: ownerPin,
    deviceId,
  });
  assert.equal(firstOwner.kind, 'authenticated');
  const owner = await client.action(api.identity.signIn, {
    staffProfileId: ownerId,
    pin: ownerPin,
    deviceId,
  });
  assert.equal(owner.kind, 'authenticated');
  ownerArgs = { sessionToken: owner.token, deviceId };
  await expectForbidden(() => client.query(api.sync.getOperationalSnapshot, {
    sessionToken: firstOwner.token,
    deviceId,
  }));
  const manager = await client.mutation(api.staff.save, {
    ...ownerArgs,
    name: 'Permission check manager',
    role: 'manager',
    clientMutationId: `${checkId}-manager-create`,
  });
  temporaryProfiles.push(manager);
  const cashier = await client.mutation(api.staff.save, {
    ...ownerArgs,
    name: 'Permission check cashier',
    role: 'cashier',
    clientMutationId: `${checkId}-cashier-create`,
  });
  temporaryProfiles.push(cashier);
  const managerPin = pin();
  const cashierPin = pin();
  await Promise.all([
    client.action(api.identity.supportSetPin, { staffProfileId: manager.id, pin: managerPin, recoveryCode: secret() }),
    client.action(api.identity.supportSetPin, { staffProfileId: cashier.id, pin: cashierPin, recoveryCode: secret() }),
  ]);
  const wrongPin = await client.action(api.identity.signIn, {
    staffProfileId: manager.id,
    pin: cashierPin,
    deviceId,
  });
  assert.deepEqual(wrongPin, { kind: 'invalid-pin' });
  const [managerSession, cashierSession] = await Promise.all([
    client.action(api.identity.signIn, { staffProfileId: manager.id, pin: managerPin, deviceId }),
    client.action(api.identity.signIn, { staffProfileId: cashier.id, pin: cashierPin, deviceId }),
  ]);
  const managerArgs = { sessionToken: managerSession.token, deviceId };
  const cashierArgs = { sessionToken: cashierSession.token, deviceId };

  await client.query(api.dashboard.getSnapshot, { ...managerArgs, businessDate: '2026-07-28' });
  await client.query(api.reports.getSummary, {
    ...managerArgs,
    fromDate: '2026-07-22',
    toDate: '2026-07-28',
  });
  await client.query(api.expenses.list, { ...managerArgs, limit: 1 });

  const snapshot = await client.query(api.sync.getOperationalSnapshot, cashierArgs);
  assert(snapshot.products.length > 0, 'Cashier must retain the bounded offline POS snapshot');
  assert.equal(JSON.stringify(snapshot).includes('monthlyAmountCentimes'), false);
  assert.equal(JSON.stringify(snapshot).includes('compensation'), false);
  await client.query(api.sales.listOrders, { ...cashierArgs, limit: 1 });

  await expectForbidden(() => client.query(api.dashboard.getSnapshot, { ...cashierArgs, businessDate: '2026-07-28' }));
  await expectForbidden(() => client.query(api.reports.getSummary, { ...cashierArgs, fromDate: '2026-07-22', toDate: '2026-07-28' }));
  await expectForbidden(() => client.query(api.categories.list, cashierArgs));
  await expectForbidden(() => client.query(api.inventory.list, {
    ...cashierArgs,
    businessDate: '2026-07-28',
  }));
  await expectForbidden(() => client.query(api.expenses.list, { ...cashierArgs, limit: 1 }));
  await expectForbidden(() => client.query(api.staff.list, cashierArgs));
  await expectForbidden(() => client.query(api.staff.listCompensation, { ...cashierArgs, staffProfileId: ownerId }));
  await expectForbidden(() => client.query(api.reports.getMonthlyCosts, { ...cashierArgs, month: '2026-07' }));
  await expectForbidden(() => client.mutation(api.categories.save, {
    ...cashierArgs,
    key: 'permission-check', name: 'Permission check', sortOrder: 1,
    clientMutationId: 'perm-check-cashier-category',
  }));
  await expectForbidden(() => client.mutation(api.inventory.saveIngredient, {
    ...cashierArgs,
    key: 'permission-check', name: 'Permission check', baseUnit: 'piece',
    openingQuantity: 0, lowStockThreshold: 0, businessDate: '2026-07-28',
    clientMutationId: 'perm-check-cashier-stock',
  }));
  await expectForbidden(() => client.mutation(api.expenses.add, {
    ...cashierArgs,
    category: 'Permission check', description: 'Denied', amountCentimes: 1,
    recurrence: 'one-time', effectiveDate: '2026-07-28',
    clientMutationId: 'perm-check-cashier-expense',
  }));
  await expectForbidden(() => client.query(api.staff.list, managerArgs));
  await expectForbidden(() => client.query(api.staff.listCompensation, { ...managerArgs, staffProfileId: ownerId }));
  await expectForbidden(() => client.query(api.reports.getMonthlyCosts, { ...managerArgs, month: '2026-07' }));
  await expectForbidden(() => client.mutation(api.staff.save, {
    ...managerArgs,
    name: 'Denied staff', role: 'cashier', clientMutationId: 'perm-check-manager-staff',
  }));
  assert((await client.query(api.staff.list, ownerArgs)).length >= 3);
  await client.query(api.reports.getMonthlyCosts, { ...ownerArgs, month: '2026-07' });
  console.log('Owner, manager, and cashier permission boundaries and cashier cache shape passed.');
} finally {
  await Promise.all(temporaryProfiles.map((profile) => client.mutation(api.staff.setArchived, {
    ...ownerArgs,
    id: profile.id,
    archived: true,
    expectedRevision: profile.revision,
    clientMutationId: `perm-check-archive-${profile.id}`,
  })));
}
