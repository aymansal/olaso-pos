import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import {
  acknowledgeManagementOperationInDatabase,
  enqueueManagementOperation,
  listPendingManagementOperationsFromDatabase,
  loadManagementOperationFromDatabase,
  recordManagementOperationFailureInDatabase,
  resolveCloudRecordIdFromDatabase,
} from '../src/data/localManagement.ts';
import { describeManagementSyncFailure } from '../src/data/managementOperation.ts';
import {
  CONNECTION_SYNC_FAILURE,
  listPendingOutboxFromDatabase,
  makeConnectivityFailuresAvailableInDatabase,
} from '../src/data/outbox.ts';
import { localMigrations } from '../src/data/schema.ts';

const directory = mkdtempSync(join(tmpdir(), 'olaso-local-management-'));
const databasePath = join(directory, 'management.sqlite');
let database;

function open() {
  database = new DatabaseSync(databasePath);
  database.exec('PRAGMA foreign_keys = ON');
  return {
    query(statement, values = []) {
      return { values: database.prepare(statement).all(...values) };
    },
    run(statement, values = []) {
      return database.prepare(statement).run(...values);
    },
  };
}

try {
  let adapter = open();
  for (const migration of localMigrations) {
    for (const statement of migration.statements) database.exec(statement);
  }
  const owner = {
    staffProfileId: 'owner-profile',
    name: 'Olaso Owner',
    role: 'owner',
  };
  const manager = {
    staffProfileId: 'manager-profile',
    name: 'Olaso Manager',
    role: 'manager',
  };
  const cashier = {
    staffProfileId: 'cashier-profile',
    name: 'Olaso Cashier',
    role: 'cashier',
  };
  const categoryInput = {
    deviceId: 'tablet-1',
    operationId: 'operation-category',
    operationType: 'management.category.save',
    localRecordId: 'local-category',
    requiredPermission: 'products',
    actor: manager,
    payload: { name: 'Cold drinks', sortOrder: 50 },
    createdAt: 100,
  };
  const category = await enqueueManagementOperation(adapter, categoryInput);
  assert.equal(category.operationId, 'operation-category');
  assert.equal(category.deviceId, 'tablet-1');
  assert.equal(category.actor.name, 'Olaso Manager');
  assert.deepEqual(category.payload, categoryInput.payload);
  assert.equal(
    (await enqueueManagementOperation(adapter, categoryInput)).operationId,
    category.operationId,
    'Retrying the same immutable operation must be idempotent.',
  );
  await assert.rejects(
    enqueueManagementOperation(adapter, {
      ...categoryInput,
      payload: { name: 'Different data' },
    }),
    /already used by another change/,
  );
  await assert.rejects(
    enqueueManagementOperation(adapter, {
      ...categoryInput,
      operationId: 'cashier-operation',
      actor: cashier,
    }),
    /cannot make this change/,
  );
  await assert.rejects(
    enqueueManagementOperation(adapter, {
      ...categoryInput,
      operationId: 'credential-operation',
      payload: { rawPin: 'redacted-test-value' },
    }),
    /Protected credentials cannot enter/,
  );
  await enqueueManagementOperation(adapter, {
    ...categoryInput,
    operationId: 'ordinary-product-copy',
    localRecordId: 'ordinary-product-copy',
    payload: { toppingName: 'Cream' },
    createdAt: 104,
  });
  await acknowledgeManagementOperationInDatabase(adapter, {
    operationId: 'ordinary-product-copy',
    recordType: 'category',
    cloudRecordId: 'ordinary-product-copy-cloud',
    acknowledgedAt: 105,
  });
  await assert.rejects(
    enqueueManagementOperation(adapter, {
      ...categoryInput,
      operationId: 'missing-dependency',
      dependsOnOperationId: 'does-not-exist',
    }),
    /dependency is unavailable/,
  );
  await enqueueManagementOperation(adapter, {
    deviceId: 'tablet-1',
    operationId: 'operation-product',
    operationType: 'management.product.save',
    localRecordId: 'local-product',
    dependsOnOperationId: 'operation-category',
    requiredPermission: 'products',
    actor: manager,
    expectedRevision: 2,
    payload: { categoryId: 'local-category', name: 'Iced tea' },
    createdAt: 101,
  });
  await enqueueManagementOperation(adapter, {
    deviceId: 'tablet-1',
    operationId: 'operation-compensation',
    operationType: 'management.compensation.save',
    localRecordId: 'local-compensation',
    requiredPermission: 'compensation',
    actor: owner,
    payload: { monthlyAmountCentimes: 550000 },
    createdAt: 102,
  });
  await assert.rejects(
    enqueueManagementOperation(adapter, {
      deviceId: 'tablet-1',
      operationId: 'manager-compensation',
      operationType: 'management.compensation.save',
      localRecordId: 'manager-compensation',
      requiredPermission: 'compensation',
      actor: manager,
      payload: { monthlyAmountCentimes: 1 },
      createdAt: 103,
    }),
    /cannot make this change/,
  );

  database.close();
  adapter = open();
  assert.equal(
    (await loadManagementOperationFromDatabase(adapter, 'operation-product'))
      ?.dependsOnOperationId,
    'operation-category',
    'Pending management data and dependency must survive restart.',
  );
  assert.deepEqual(
    (await listPendingManagementOperationsFromDatabase(
      adapter,
      ['management.category.save', 'management.product.save'],
      200,
      10,
    )).map((operation) => operation.operationId),
    ['operation-category'],
    'A child operation must wait for its parent acknowledgement.',
  );
  const failedUntil = await recordManagementOperationFailureInDatabase(adapter, {
    operationId: 'operation-category',
    attemptCount: 0,
    error: CONNECTION_SYNC_FAILURE,
    failedAt: 200,
  });
  assert.equal(failedUntil, 1200);
  await assert.rejects(
    recordManagementOperationFailureInDatabase(adapter, {
      operationId: 'missing-operation',
      attemptCount: 0,
      error: 'Safe failure',
      failedAt: 200,
    }),
    /Pending management operation is unavailable/,
  );
  assert.deepEqual(
    (await listPendingOutboxFromDatabase(adapter, 200, 10)).map(
      (operation) => operation.operationId,
    ),
    ['operation-compensation'],
  );
  await makeConnectivityFailuresAvailableInDatabase(adapter);
  assert.deepEqual(
    (await listPendingManagementOperationsFromDatabase(
      adapter,
      ['management.category.save'],
      200,
      10,
    )).map((operation) => operation.operationId),
    ['operation-category'],
  );
  assert.equal(
    await acknowledgeManagementOperationInDatabase(adapter, {
      operationId: 'operation-category',
      recordType: 'category',
      cloudRecordId: 'cloud-category',
      acknowledgedAt: 300,
    }),
    'local-category',
  );
  assert.deepEqual(
    (await listPendingManagementOperationsFromDatabase(
      adapter,
      ['management.product.save'],
      300,
      10,
    )).map((operation) => operation.operationId),
    ['operation-product'],
    'The child must become eligible after its parent is acknowledged.',
  );
  await acknowledgeManagementOperationInDatabase(adapter, {
    operationId: 'operation-category',
    recordType: 'category',
    cloudRecordId: 'cloud-category',
    acknowledgedAt: 300,
  });
  await assert.rejects(
    acknowledgeManagementOperationInDatabase(adapter, {
      operationId: 'operation-category',
      recordType: 'category',
      cloudRecordId: 'different-cloud-category',
      acknowledgedAt: 301,
    }),
    /does not match/,
  );
  const acknowledged = await loadManagementOperationFromDatabase(
    adapter,
    'operation-category',
  );
  assert.equal(acknowledged?.cloudRecordId, 'cloud-category');
  assert.equal(acknowledged?.acknowledgedAt, 300);
  assert.equal(
    await resolveCloudRecordIdFromDatabase(adapter, 'category', 'local-category'),
    'cloud-category',
  );
  assert.equal(
    await resolveCloudRecordIdFromDatabase(adapter, 'product', 'existing-cloud-id'),
    'existing-cloud-id',
  );
  assert.equal(
    database.prepare(
      "SELECT COUNT(*) count FROM outbox WHERE operation_id = 'operation-category'",
    ).get().count,
    0,
  );
  assert.equal(
    describeManagementSyncFailure(new Error('Failed to fetch while offline')),
    CONNECTION_SYNC_FAILURE,
  );
  assert.match(
    describeManagementSyncFailure(new Error('Expected revision is stale')),
    /conflicts with a newer record/,
  );
  assert.match(
    describeManagementSyncFailure(new Error('secret server detail')),
    /Management synchronization failed/,
  );
} finally {
  try { database?.close(); } catch { /* already closed */ }
  rmSync(directory, {
    recursive: true,
    force: true,
    maxRetries: 20,
    retryDelay: 250,
  });
}

console.log('Local-first management operation checks passed.');
