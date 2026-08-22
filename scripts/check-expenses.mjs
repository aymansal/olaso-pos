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
  return ownerSession(client, root, 'expenses-check-device');
}

const sessionArgs = await reset();
const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
const mutation = (reference, args) => client.mutation(reference, { ...sessionArgs, ...args });
try {
  const args = {
    category: 'Rent',
    description: 'August rent',
    amountCentimes: 1200000,
    recurrence: 'monthly',
    effectiveStartMonth: '2026-08',
    clientMutationId: 'cost07-rent-create',
  };
  const created = await mutation(api.expenses.add, args);
  const retry = await mutation(api.expenses.add, args);
  assert.equal(retry.id, created.id);
  await assert.rejects(
    mutation(api.expenses.add, {
      category: 'Bad date', description: 'Bad', amountCentimes: 1,
      recurrence: 'one-time', effectiveStartMonth: '2026-08',
      clientMutationId: 'cost07-invalid-date',
    }),
    /require only an effective date/,
  );
  const corrected = await mutation(api.expenses.correct, {
    expenseId: created.id,
    expectedRevision: created.revision,
    category: 'Rent',
    description: 'August rent corrected',
    amountCentimes: 1250000,
    recurrence: 'monthly',
    effectiveStartMonth: '2026-08',
    clientMutationId: 'cost07-rent-correction',
  });
  assert.notEqual(corrected.reversalId, corrected.replacementId);
  const expenses = await query(api.expenses.list, { limit: 20 });
  assert.equal(expenses.filter((row) => row.category === 'Rent').length, 3);
  assert.equal(expenses.find((row) => row.id === corrected.reversalId)?.transactionType, 'reversal');
} finally {
  await reset();
}

console.log('Operating expense checks passed.');
