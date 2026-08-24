import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { ownerSession, requireOwnerTestPin } from './owner-session.mjs';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');

const client = new ConvexHttpClient(convexUrl);
requireOwnerTestPin();
execSync('npm run seed:dev', { cwd: projectRoot, stdio: 'pipe', encoding: 'utf8' });
const sessionArgs = await ownerSession(client, projectRoot, 'reports-check-device');
const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
const report = await query(api.reports.getSummary, {
  fromDate: '2026-07-22',
  toDate: '2026-07-28',
});

assert.deepEqual(report.range, {
  from: '2026-07-22',
  to: '2026-07-28',
  days: 7,
});
assert.equal(report.daily.length, 7);
assert.equal(report.daily[0].businessDate, '2026-07-22');
assert.equal(report.daily.at(-1).businessDate, '2026-07-28');
assert.equal(
  report.current.netCentimes,
  report.daily.reduce((total, day) => total + day.netCentimes, 0),
);
assert.equal(
  report.current.itemCount,
  report.daily.reduce((total, day) => total + day.itemCount, 0),
);
assert(report.current.orderCount > 0);
assert(report.current.productTotals.length > 0);
assert(
  report.current.productTotals.every((product) => product.categoryName),
);
assert(report.current.categoryTotals.length > 0);
assert(report.current.paymentTotals.length > 0);
assert(report.current.ingredientTotals.length > 0);
assert(
  report.current.productTotals.length <= 20
  && report.current.categoryTotals.length <= 20
  && report.current.paymentTotals.length <= 20
  && report.current.ingredientTotals.length <= 20,
);
assert.equal(
  report.current.ingredientUsageEventCount,
  report.daily.reduce(
    (total, day) => total + day.ingredientUsageEventCount,
    0,
  ),
);
assert(
  report.current.ingredientTotals.every(
    (ingredient) =>
      Number.isSafeInteger(ingredient.quantity)
      && ingredient.quantity > 0,
  ),
);
assert.equal(report.previous.netCentimes, 0);

const empty = await query(api.reports.getSummary, {
  fromDate: '2026-08-01',
  toDate: '2026-08-07',
});
assert.equal(empty.current.orderCount, 0);
assert.equal(empty.current.productTotals.length, 0);
assert(empty.daily.every((day) => day.netCentimes === 0));

await assert.rejects(
  query(api.reports.getSummary, {
    fromDate: '2026-07-01',
    toDate: '2026-08-01',
  }),
  /Report periods must contain 1 to 31 days/,
);

console.log('Bounded saved-summary report checks passed.');
