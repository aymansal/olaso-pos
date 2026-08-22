import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { ownerSession } from './owner-session.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const url = env.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(url, 'VITE_CONVEX_URL is missing from .env.local');
const client = new ConvexHttpClient(url);
async function reset() {
  execSync('npm run seed:dev', { cwd: root, stdio: 'pipe' });
  return ownerSession(client, root, 'monthly-costs-check-device');
}

const sessionArgs = await reset();
const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
try {
  const report = await query(api.reports.getMonthlyCosts, { month: '2026-07' });
  assert.equal(report.revenueCentimes, 48600);
  assert.equal(report.ingredientCostCentimes, 0);
  assert.equal(report.compensationCentimes, 550000);
  assert.equal(report.otherExpenseCentimes, 0);
  assert.equal(report.operatingProfitCentimes, -501400);
  assert.equal(report.complete, true);
  await assert.rejects(
    query(api.reports.getMonthlyCosts, { month: '2026-13' }),
    /Month must use YYYY-MM/,
  );
} finally {
  await reset();
}

console.log('Monthly cost report checks passed.');
