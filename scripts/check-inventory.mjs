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
