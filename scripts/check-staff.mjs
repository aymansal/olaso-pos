import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
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
try {
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
