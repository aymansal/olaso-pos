import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const url = env.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(url, 'VITE_CONVEX_URL is missing from .env.local');
const client = new ConvexHttpClient(url);
const reset = () => execSync('npm run seed:dev', { cwd: root, stdio: 'pipe' });

reset();
try {
  const args = {
    category: 'Rent',
    description: 'August rent',
    amountCentimes: 1200000,
    recurrence: 'monthly',
    effectiveStartMonth: '2026-08',
    clientMutationId: 'cost07-rent-create',
  };
  const created = await client.mutation(api.expenses.add, args);
  const retry = await client.mutation(api.expenses.add, args);
  assert.equal(retry.id, created.id);
  await assert.rejects(
    client.mutation(api.expenses.add, {
      category: 'Bad date', description: 'Bad', amountCentimes: 1,
      recurrence: 'one-time', effectiveStartMonth: '2026-08',
      clientMutationId: 'cost07-invalid-date',
    }),
    /require only an effective date/,
  );
  const corrected = await client.mutation(api.expenses.correct, {
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
  const expenses = await client.query(api.expenses.list, { limit: 20 });
  assert.equal(expenses.filter((row) => row.category === 'Rent').length, 3);
  assert.equal(expenses.find((row) => row.id === corrected.reversalId)?.transactionType, 'reversal');
} finally {
  reset();
}

console.log('Operating expense checks passed.');
