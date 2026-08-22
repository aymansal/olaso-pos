import assert from 'node:assert/strict';
import {
  allocateCentimes,
  combineCosts,
  consumeValuation,
  marginBasisPoints,
  occursInMonth,
  receiveValuation,
} from '../src/lib/costs.ts';

const received = receiveValuation(
  { quantity: 0, inventoryValueCentimes: 0, complete: true },
  10_000,
  20_000,
);
assert.deepEqual(received, {
  quantity: 10_000,
  inventoryValueCentimes: 20_000,
  complete: true,
});
assert.equal(allocateCentimes(20_000, 10_000, 250), 500);
assert.deepEqual(consumeValuation(received, 250), {
  next: { quantity: 9_750, inventoryValueCentimes: 19_500, complete: true },
  cost: { complete: true, costCentimes: 500 },
});
assert.deepEqual(
  receiveValuation({ quantity: 300, complete: false }, 100, 1_000),
  { quantity: 400, complete: false },
);
assert.deepEqual(
  receiveValuation({ quantity: 0, complete: false }, 1_000, 2_000),
  { quantity: 1_000, inventoryValueCentimes: 2_000, complete: true },
);
assert.deepEqual(
  combineCosts([
    { complete: true, costCentimes: 125 },
    { complete: false, missingIngredientIds: ['milk', 'coffee'] },
    { complete: false, missingIngredientIds: ['coffee'] },
  ]),
  { complete: false, missingIngredientIds: ['coffee', 'milk'] },
);
assert.equal(marginBasisPoints(1_800, { complete: true, costCentimes: 500 }), 7_222);
assert.equal(marginBasisPoints(1_800, { complete: false, missingIngredientIds: ['milk'] }), undefined);
assert.equal(occursInMonth('2026-08', '2026-07'), true);
assert.equal(occursInMonth('2026-09', '2026-07', '2026-08'), false);

console.log('Exact cost calculation checks passed.');
