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
const mutationId = (label) => `app03-check-${label}`;

async function reseed() {
  requireOwnerTestPin();
  execSync('npm run seed:dev', {
    cwd: projectRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return ownerSession(client, projectRoot, 'management-check-device');
}

async function verifyManagement() {
  const sessionArgs = await reseed();
  const query = (reference, args) => client.query(reference, { ...sessionArgs, ...args });
  const mutation = (reference, args) => client.mutation(reference, { ...sessionArgs, ...args });
  try {
    const [initialCategories, initialProducts, initialIngredients] =
      await Promise.all([
        query(api.categories.list, {}),
        query(api.products.list, {}),
        query(api.inventory.list, { businessDate: '2026-07-28' }),
      ]);
    assert.equal(initialCategories.length, 4);
    assert.equal(initialProducts.length, 15);
    assert.ok(initialIngredients.ingredients.length > 1);

    const categoryCreateArgs = {
      key: 'app03-test-category',
      name: 'APP-03 Test Category',
      artworkKey: 'neutral',
      sortOrder: 90,
      clientMutationId: mutationId('category-create'),
    };
    const categoryCreated = await mutation(
      api.categories.save,
      categoryCreateArgs,
    );
    const categoryRetry = await mutation(
      api.categories.save,
      categoryCreateArgs,
    );
    assert.equal(categoryRetry.id, categoryCreated.id);
    assert.equal(categoryRetry.revision, categoryCreated.revision);

    const categoryUpdated = await mutation(api.categories.save, {
      id: categoryCreated.id,
      name: 'APP-03 Renamed Category',
      artworkKey: 'cold-drinks',
      sortOrder: 91,
      expectedRevision: categoryCreated.revision,
      clientMutationId: mutationId('category-update'),
    });
    assert.equal(
      (await query(api.categories.list, {})).find(
        (category) => category._id === categoryCreated.id,
      )?.artworkKey,
      'cold-drinks',
    );
    const categoryArchived = await mutation(
      api.categories.setArchived,
      {
        id: categoryCreated.id,
        archived: true,
        expectedRevision: categoryUpdated.revision,
        clientMutationId: mutationId('category-archive'),
      },
    );
    const categoryRestored = await mutation(
      api.categories.setArchived,
      {
        id: categoryCreated.id,
        archived: false,
        expectedRevision: categoryArchived.revision,
        clientMutationId: mutationId('category-restore'),
      },
    );
    assert.equal(categoryRestored.revision, 4);

    const productCreateArgs = {
      key: 'app03-test-product',
      categoryId: categoryCreated.id,
      name: 'APP-03 Test Product',
      receiptName: 'APP-03 Test Product',
      basePriceCentimes: 2800,
      status: 'active',
      sortOrder: 990,
      clientMutationId: mutationId('product-create'),
    };
    const productCreated = await mutation(
      api.products.save,
      productCreateArgs,
    );
    const productRetry = await mutation(
      api.products.save,
      productCreateArgs,
    );
    assert.equal(productRetry.id, productCreated.id);

    const productUpdated = await mutation(api.products.save, {
      id: productCreated.id,
      categoryId: categoryCreated.id,
      name: 'APP-03 Updated Product',
      receiptName: 'APP-03 Updated Product',
      basePriceCentimes: 3000,
      status: 'unavailable',
      sortOrder: 991,
      expectedRevision: productCreated.revision,
      clientMutationId: mutationId('product-update'),
    });
    const productArchived = await mutation(api.products.setStatus, {
      id: productCreated.id,
      status: 'archived',
      expectedRevision: productUpdated.revision,
      clientMutationId: mutationId('product-archive'),
    });
    const productRestored = await mutation(api.products.setStatus, {
      id: productCreated.id,
      status: 'active',
      expectedRevision: productArchived.revision,
      clientMutationId: mutationId('product-restore'),
    });
    assert.equal(productRestored.revision, 4);

    const recipeV1Args = {
      productId: productCreated.id,
      expectedProductRevision: productRestored.revision,
      clientMutationId: mutationId('recipe-v1'),
      items: [
        {
          ingredientId: initialIngredients.ingredients[0]._id,
          quantity: 18,
        },
        {
          ingredientId: initialIngredients.ingredients[1]._id,
          quantity: 1,
        },
      ],
    };
    const recipeV1 = await mutation(
      api.recipes.saveVersion,
      recipeV1Args,
    );
    const recipeV1Retry = await mutation(
      api.recipes.saveVersion,
      recipeV1Args,
    );
    assert.equal(recipeV1Retry.id, recipeV1.id);
    assert.equal(recipeV1Retry.productRevision, recipeV1.productRevision);

    const recipeV2 = await mutation(api.recipes.saveVersion, {
      productId: productCreated.id,
      expectedProductRevision: recipeV1.productRevision,
      clientMutationId: mutationId('recipe-v2'),
      items: [
        {
          ingredientId: initialIngredients.ingredients[0]._id,
          quantity: 20,
        },
        {
          ingredientId: initialIngredients.ingredients[1]._id,
          quantity: 1,
        },
      ],
    });
    assert.equal(recipeV2.versionNumber, 2);

    const recipeEditor = await query(api.recipes.getEditorData, {
      productId: productCreated.id,
    });
    assert.equal(recipeEditor.recipe?.versionNumber, 2);
    assert.equal(recipeEditor.versions.length, 2);
    assert.equal(
      recipeEditor.versions.find((version) => version.versionNumber === 1)
        ?.status,
      'superseded',
    );
    assert.equal(recipeEditor.items[0]?.quantity, 20);

    const removedCategory = await mutation(api.categories.remove, {
      id: categoryCreated.id,
      expectedRevision: categoryRestored.revision,
      clientMutationId: mutationId('category-delete'),
    });
    assert.equal(removedCategory.deleted, true);
    const uncategorized = (await query(api.products.list, {})).find(
      (item) => item._id === productCreated.id,
    );
    assert.equal(uncategorized?.categoryId, undefined);
    const uncategorizedSaved = await mutation(api.products.save, {
      id: productCreated.id,
      name: uncategorized.name,
      receiptName: uncategorized.receiptName,
      basePriceCentimes: uncategorized.basePriceCentimes,
      status: 'active',
      sortOrder: uncategorized.sortOrder,
      expectedRevision: uncategorized.revision,
      clientMutationId: mutationId('product-uncategorized'),
    });
    const removedProduct = await mutation(api.products.remove, {
      id: productCreated.id,
      expectedRevision: uncategorizedSaved.revision,
      clientMutationId: mutationId('product-delete'),
    });
    assert.equal(removedProduct.deleted, true);
    assert.equal((await mutation(api.products.remove, {
      id: productCreated.id,
      expectedRevision: uncategorizedSaved.revision,
      clientMutationId: mutationId('product-delete'),
    })).deleted, true);
    assert.equal((await query(api.products.list, {})).some(
      (item) => item._id === productCreated.id,
    ), false);

    const disposable = await mutation(api.inventory.saveIngredient, {
      key: 'app03-delete-ingredient',
      name: 'APP-03 Delete ingredient',
      baseUnit: 'gram',
      lowStockThreshold: 0,
      openingQuantity: 20,
      businessDate: '2026-08-25',
      clientMutationId: mutationId('ingredient-for-delete'),
    });
    const repairProduct = await mutation(api.products.save, {
      key: 'app03-ingredient-repair-product',
      categoryId: initialCategories[0]._id,
      name: 'APP-03 Ingredient repair', receiptName: 'APP-03 Ingredient repair',
      basePriceCentimes: 2800, status: 'active', sortOrder: 990,
      clientMutationId: mutationId('product-for-ingredient-delete'),
    });
    const beforeRepair = await mutation(api.recipes.saveVersion, {
      productId: repairProduct.id,
      expectedProductRevision: repairProduct.revision,
      clientMutationId: mutationId('recipe-for-ingredient-delete'),
      items: [{ ingredientId: disposable.id, quantity: 5 },
        { ingredientId: initialIngredients.ingredients[0]._id, quantity: 10 }],
    });
    const removalArgs = {
      id: disposable.id,
      expectedRevision: disposable.revision,
      repairProductIds: [repairProduct.id],
      clientMutationId: mutationId('ingredient-delete'),
    };
    const removedIngredient = await mutation(api.inventory.removeIngredient, removalArgs);
    assert.equal(removedIngredient.deleted, true);
    assert.equal(removedIngredient.repairs.length, 1);
    assert.equal((await mutation(api.inventory.removeIngredient, removalArgs))
      .repairs[0]?.recipeVersionId, removedIngredient.repairs[0].recipeVersionId);
    const repaired = (await query(api.products.list, {})).find(
      (item) => item._id === repairProduct.id,
    );
    assert.equal(repaired?.status, 'unavailable');
    assert.equal(repaired?.revision, beforeRepair.productRevision + 1);
    const repairedRecipe = await query(api.recipes.getEditorData, {
      productId: repairProduct.id,
    });
    assert.equal(repairedRecipe.items.length, 1);
    assert.equal(repairedRecipe.items[0].ingredientId,
      initialIngredients.ingredients[0]._id);

    const temporaryStaff = await mutation(api.staff.save, {
      name: 'APP-03 Deletable cashier', role: 'cashier',
      clientMutationId: mutationId('staff-for-delete'),
    });
    await mutation(api.staff.addCompensationPeriod, {
      staffProfileId: temporaryStaff.id,
      monthlyAmountCentimes: 400000,
      effectiveStartMonth: '2026-08',
      clientMutationId: mutationId('staff-compensation-for-delete'),
    });
    const removedStaff = await mutation(api.staff.remove, {
      id: temporaryStaff.id, expectedRevision: temporaryStaff.revision,
      clientMutationId: mutationId('staff-delete'),
    });
    assert.equal(removedStaff.deleted, true);
    assert.equal((await query(api.staff.list, {})).some(
      (member) => member.id === temporaryStaff.id,
    ), false);
    const retainedWages = (await query(api.staff.listAllCompensation, {})).find(
      (period) => period.staffProfileId === temporaryStaff.id,
    );
    assert.equal(retainedWages?.staffNameSnapshot, 'APP-03 Deletable cashier');
    assert.equal(retainedWages?.staffRoleSnapshot, 'cashier');
  } finally {
    await reseed();
  }
}

await verifyManagement();
console.log('Product management checks passed.');
