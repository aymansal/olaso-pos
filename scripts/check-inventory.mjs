import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');

const client = new ConvexHttpClient(convexUrl);
const businessDate = '2026-07-28';
const mutationId = (label) => `app04-check-${label}`;

function reseed() {
  execSync('npm run seed:dev', {
    cwd: projectRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

async function verifyInventory() {
  reseed();
  try {
    const initial = await client.query(api.inventory.list, { businessDate });
    assert.equal(initial.ingredients.length, 14);
    assert.equal(initial.metrics.ingredientCount, 14);
    assert.equal(initial.metrics.lowStockCount, 2);
    const wholeMilk = initial.ingredients.find(
      (ingredient) => ingredient.key === 'whole-milk',
    );
    const brioche = initial.ingredients.find(
      (ingredient) => ingredient.key === 'brioche',
    );
    assert.equal(wholeMilk?.costStatus, 'complete');
    assert.equal(wholeMilk?.inventoryValueCentimes, 66_960);
    assert.equal(brioche?.costStatus, 'incomplete');
    assert.equal(brioche?.inventoryValueCentimes, undefined);
    const milkPurchaseArgs = {
      ingredientId: wholeMilk._id,
      packageLabel: '1 L carton',
      packageCount: 10,
      quantityPerPackage: 1_000,
      packagePriceCentimes: 2_000,
      receivedAt: Date.parse('2026-07-28T10:00:00.000Z'),
      businessDate,
      supplierLabel: 'APP-04 fixture supplier',
      note: 'Ten cartons for weighted-average verification',
      expectedRevision: wholeMilk.revision,
      clientMutationId: mutationId('milk-purchase'),
    };
    const milkPurchase = await client.mutation(
      api.inventory.receivePurchase,
      milkPurchaseArgs,
    );
    const milkPurchaseRetry = await client.mutation(
      api.inventory.receivePurchase,
      milkPurchaseArgs,
    );
    assert.equal(milkPurchaseRetry.purchaseId, milkPurchase.purchaseId);
    assert.equal(milkPurchase.currentStockQuantity, 43_480);
    assert.equal(milkPurchase.inventoryValueCentimes, 86_960);
    assert.equal(milkPurchase.costStatus, 'complete');
    const milkDetail = await client.query(api.inventory.getDetail, {
      ingredientId: wholeMilk._id,
    });
    assert.equal(milkDetail.movements[0].movementType, 'purchase');
    assert.equal(milkDetail.movements[0].quantityDelta, 10_000);
    assert.equal(milkDetail.movements[0].costDeltaCentimes, 20_000);
    assert.equal(milkDetail.movements[0].inventoryValueAfterCentimes, 86_960);
    const correctionArgs = {
      purchaseId: milkPurchase.purchaseId,
      packageLabel: '1 L carton',
      packageCount: 8,
      quantityPerPackage: 1_000,
      packagePriceCentimes: 2_500,
      receivedAt: Date.parse('2026-07-28T10:05:00.000Z'),
      businessDate,
      note: 'Corrected delivery count and package price',
      expectedRevision: milkPurchase.ingredientRevision,
      clientMutationId: mutationId('milk-correction'),
    };
    const correction = await client.mutation(
      api.inventory.correctPurchase,
      correctionArgs,
    );
    const correctionRetry = await client.mutation(
      api.inventory.correctPurchase,
      correctionArgs,
    );
    assert.equal(
      correctionRetry.replacementPurchaseId,
      correction.replacementPurchaseId,
    );
    assert.equal(correction.currentStockQuantity, 41_480);
    assert.equal(correction.inventoryValueCentimes, 86_960);
    const loss = await client.mutation(api.inventory.recordAdjustment, {
      ingredientId: wholeMilk._id,
      mode: 'set-count',
      quantity: 40_000,
      reason: 'APP-04 valued count loss',
      expectedRevision: correction.ingredientRevision,
      businessDate,
      clientMutationId: mutationId('milk-count-loss'),
    });
    assert.equal(loss.currentStockQuantity, 40_000);
    const increase = await client.mutation(api.inventory.recordAdjustment, {
      ingredientId: wholeMilk._id,
      mode: 'set-count',
      quantity: 40_100,
      reason: 'APP-04 valued count increase',
      expectedRevision: loss.ingredientRevision,
      businessDate,
      clientMutationId: mutationId('milk-count-increase'),
    });
    assert.equal(increase.currentStockQuantity, 40_100);
    const valuedDetail = await client.query(api.inventory.getDetail, {
      ingredientId: wholeMilk._id,
    });
    assert.deepEqual(
      valuedDetail.movements.slice(0, 4).map((movement) => [
        movement.movementType,
        movement.quantityDelta,
        movement.costDeltaCentimes,
      ]),
      [
        ['manual-adjustment', 100, 210],
        ['manual-adjustment', -1_480, -3_103],
        ['purchase', 8_000, 20_000],
        ['purchase-reversal', -10_000, -20_000],
      ],
    );
    assert.equal(
      valuedDetail.ingredient.inventoryValueCentimes,
      84_067,
    );

    const createArgs = {
      key: 'app04-test-ingredient',
      name: 'APP-04 Test Ingredient',
      baseUnit: 'gram',
      lowStockThreshold: 10,
      openingQuantity: 20,
      businessDate,
      clientMutationId: mutationId('ingredient-create'),
    };
    const created = await client.mutation(
      api.inventory.saveIngredient,
      createArgs,
    );
    const createRetry = await client.mutation(
      api.inventory.saveIngredient,
      createArgs,
    );
    assert.equal(createRetry.id, created.id);
    assert.equal(createRetry.revision, created.revision);

    const updated = await client.mutation(api.inventory.saveIngredient, {
      id: created.id,
      name: 'APP-04 Updated Ingredient',
      baseUnit: 'gram',
      lowStockThreshold: 12,
      expectedRevision: created.revision,
      businessDate,
      clientMutationId: mutationId('ingredient-update'),
    });
    assert.equal(updated.revision, 2);

    const receiveArgs = {
      ingredientId: created.id,
      mode: 'receive',
      quantity: 5,
      reason: 'APP-04 test delivery',
      expectedRevision: updated.revision,
      businessDate,
      clientMutationId: mutationId('receive'),
    };
    const received = await client.mutation(
      api.inventory.recordAdjustment,
      receiveArgs,
    );
    const receiveRetry = await client.mutation(
      api.inventory.recordAdjustment,
      receiveArgs,
    );
    assert.equal(receiveRetry.movementId, received.movementId);
    assert.equal(receiveRetry.currentStockQuantity, 25);

    const counted = await client.mutation(api.inventory.recordAdjustment, {
      ingredientId: created.id,
      mode: 'set-count',
      quantity: 17,
      reason: 'APP-04 verified physical count',
      expectedRevision: received.ingredientRevision,
      businessDate,
      clientMutationId: mutationId('count'),
    });
    assert.equal(counted.currentStockQuantity, 17);

    await assert.rejects(
      client.mutation(api.inventory.recordAdjustment, {
        ingredientId: created.id,
        mode: 'receive',
        quantity: 1,
        reason: 'Stale test',
        expectedRevision: updated.revision,
        businessDate,
        clientMutationId: mutationId('stale'),
      }),
      /changed after it was loaded/,
    );

    const detail = await client.query(api.inventory.getDetail, {
      ingredientId: created.id,
    });
    assert.equal(detail.ingredient.currentStockQuantity, 17);
    assert.equal(detail.movements.length, 3);
    assert.equal(
      detail.movements.reduce(
        (total, movement) => total + movement.quantityDelta,
        0,
      ),
      17,
    );
    assert.deepEqual(
      detail.movements.map((movement) => movement.movementType).sort(),
      ['manual-adjustment', 'stock-addition', 'stock-addition'],
    );

    const archived = await client.mutation(
      api.inventory.setIngredientArchived,
      {
        id: created.id,
        archived: true,
        expectedRevision: counted.ingredientRevision,
        clientMutationId: mutationId('archive'),
      },
    );
    const restored = await client.mutation(
      api.inventory.setIngredientArchived,
      {
        id: created.id,
        archived: false,
        expectedRevision: archived.revision,
        clientMutationId: mutationId('restore'),
      },
    );
    assert.equal(restored.revision, 6);

    const finalInventory = await client.query(api.inventory.list, {
      businessDate,
    });
    assert.equal(finalInventory.ingredients.length, 15);
    assert.equal(
      finalInventory.ingredients.find(
        (ingredient) => ingredient._id === created.id,
      )?.currentStockQuantity,
      17,
    );
  } finally {
    reseed();
  }
}

await verifyInventory();
console.log('Inventory management checks passed.');
