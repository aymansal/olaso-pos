import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import { ownerSession } from './owner-session.mjs';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const localEnv = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const convexUrl = localEnv.match(/^VITE_CONVEX_URL=(.+)$/m)?.[1]?.trim();
assert(convexUrl, 'VITE_CONVEX_URL is missing from .env.local');

const client = new ConvexHttpClient(convexUrl);
const mutationId = (label) => `app03-check-${label}`;

async function reseed() {
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
    const [initialCategories, initialProducts, initialModifiers] =
      await Promise.all([
        query(api.categories.list, {}),
        query(api.products.list, {}),
        query(api.modifiers.list, {}),
      ]);
    assert.equal(initialCategories.length, 4);
    assert.equal(initialProducts.length, 15);
    assert.equal(initialModifiers.groups.length, 4);

    const categoryCreateArgs = {
      key: 'app03-test-category',
      name: 'APP-03 Test Category',
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
      sortOrder: 91,
      expectedRevision: categoryCreated.revision,
      clientMutationId: mutationId('category-update'),
    });
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

    const modifierCreateArgs = {
      key: 'app03-test-group',
      name: 'APP-03 Test Group',
      required: false,
      minSelections: 0,
      maxSelections: 1,
      sortOrder: 90,
      clientMutationId: mutationId('modifier-create'),
      options: [
        {
          key: 'app03-test-option',
          name: 'APP-03 Test Option',
          priceDeltaCentimes: 250,
          ingredientEffects: [],
          status: 'active',
          sortOrder: 10,
        },
      ],
    };
    const modifierCreated = await mutation(
      api.modifiers.saveGroup,
      modifierCreateArgs,
    );
    const modifierRetry = await mutation(
      api.modifiers.saveGroup,
      modifierCreateArgs,
    );
    assert.equal(modifierRetry.id, modifierCreated.id);
    const modifiersAfterCreate = await query(api.modifiers.list, {});
    const createdOption = modifiersAfterCreate.options.find(
      (option) => option.groupId === modifierCreated.id,
    );
    assert(createdOption);

    const modifierUpdated = await mutation(api.modifiers.saveGroup, {
      id: modifierCreated.id,
      name: 'APP-03 Updated Group',
      required: true,
      minSelections: 1,
      maxSelections: 1,
      sortOrder: 91,
      expectedRevision: modifierCreated.revision,
      clientMutationId: mutationId('modifier-update'),
      options: [
        {
          id: createdOption._id,
          key: createdOption.key,
          name: 'APP-03 Updated Option',
          priceDeltaCentimes: 300,
          ingredientEffects: [],
          status: 'active',
          sortOrder: 10,
        },
      ],
    });
    const modifierArchived = await mutation(
      api.modifiers.setGroupArchived,
      {
        id: modifierCreated.id,
        archived: true,
        expectedRevision: modifierUpdated.revision,
        clientMutationId: mutationId('modifier-archive'),
      },
    );
    const modifierRestored = await mutation(
      api.modifiers.setGroupArchived,
      {
        id: modifierCreated.id,
        archived: false,
        expectedRevision: modifierArchived.revision,
        clientMutationId: mutationId('modifier-restore'),
      },
    );
    assert.equal(modifierRestored.revision, 4);

    const productCreateArgs = {
      key: 'app03-test-product',
      categoryId: categoryCreated.id,
      name: 'APP-03 Test Product',
      receiptName: 'APP-03 Test Product',
      basePriceCentimes: 2800,
      status: 'active',
      sortOrder: 990,
      modifierGroupIds: [modifierCreated.id],
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
      modifierGroupIds: [modifierCreated.id],
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
          ingredientId: initialModifiers.ingredients[0]._id,
          quantity: 18,
        },
        {
          ingredientId: initialModifiers.ingredients[1]._id,
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
          ingredientId: initialModifiers.ingredients[0]._id,
          quantity: 20,
        },
        {
          ingredientId: initialModifiers.ingredients[1]._id,
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
  } finally {
    await reseed();
  }
}

await verifyManagement();
console.log('Product management checks passed.');
