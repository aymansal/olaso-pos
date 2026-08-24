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
const sessionArgs = await ownerSession(client, projectRoot, 'dashboard-check-device');
const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
const snapshot = await query(api.dashboard.getSnapshot, {
  businessDate: '2026-07-28',
});

assert.equal(snapshot.businessDate, '2026-07-28');
assert.equal(snapshot.dailySales.length, 12);
assert.equal(snapshot.dailySales.at(-1).businessDate, '2026-07-28');
assert(
  snapshot.dailySales.every(
    (day, index, days) =>
      index === 0 || day.businessDate > days[index - 1].businessDate,
  ),
);
assert(snapshot.today);
assert(snapshot.today.orderCount > 0);
assert(snapshot.today.itemCount >= snapshot.today.orderCount);
assert(snapshot.today.bestSeller);
assert(snapshot.yesterday);

assert(snapshot.warnings.length <= 4);
assert(
  snapshot.warnings.every(
    (warning) =>
      warning.currentStockQuantity <= warning.lowStockThreshold,
  ),
);

assert.equal(snapshot.recentOrders.length, 4);
assert(
  snapshot.recentOrders.every(
    (order, index, orders) =>
      order.itemCount > 0
      && (index === 0 || order.completedAt <= orders[index - 1].completedAt),
  ),
);

await assert.rejects(
  query(api.dashboard.getSnapshot, {
    businessDate: '2026-02-30',
  }),
  /Business date must use YYYY-MM-DD/,
);

console.log('Bounded saved-summary Dashboard checks passed.');
