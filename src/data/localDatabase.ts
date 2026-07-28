import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader/index.js';
import {
  LOCAL_DATABASE_NAME,
  LOCAL_SCHEMA_VERSION,
  localMigrations,
} from './schema.ts';

let connectionPromise: Promise<SQLiteDBConnection> | undefined;
let sqliteConnection: SQLiteConnection | undefined;
let transactionTail: Promise<void> = Promise.resolve();

async function initializeWebStore(sqlite: SQLiteConnection) {
  if (Capacitor.getPlatform() !== 'web') return;
  defineCustomElements(window);
  if (!document.querySelector('jeep-sqlite')) {
    const element = document.createElement('jeep-sqlite');
    element.style.display = 'none';
    document.body.append(element);
  }
  await sqlite.initWebStore();
}

async function createConnection() {
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  sqliteConnection = sqlite;
  await initializeWebStore(sqlite);
  await sqlite.addUpgradeStatement(
    LOCAL_DATABASE_NAME,
    localMigrations.map(({ toVersion, statements }) => ({
      toVersion,
      statements: [...statements],
    })),
  );
  await sqlite.checkConnectionsConsistency();

  const existing = await sqlite.isConnection(LOCAL_DATABASE_NAME, false);
  const database = existing.result
    ? await sqlite.retrieveConnection(LOCAL_DATABASE_NAME, false)
    : await sqlite.createConnection(
        LOCAL_DATABASE_NAME,
        false,
        'no-encryption',
        LOCAL_SCHEMA_VERSION,
        false,
      );
  if (!(await database.isDBOpen()).result) {
    await database.open();
  }
  await database.execute('PRAGMA foreign_keys = ON;');
  await persistLocalDatabase();
  return database;
}

export function openLocalDatabase() {
  connectionPromise ??= createConnection().catch((error) => {
    connectionPromise = undefined;
    throw error;
  });
  return connectionPromise;
}

export function withLocalTransaction<T>(
  operation: (database: SQLiteDBConnection) => Promise<T>,
) {
  return serializeLocalTransaction(async () => {
    const database = await openLocalDatabase();
    await database.beginTransaction();
    try {
      const result = await operation(database);
      await database.commitTransaction();
      await persistLocalDatabase();
      return result;
    } catch (error) {
      if ((await database.isTransactionActive()).result) {
        await database.rollbackTransaction();
      }
      throw error;
    }
  });
}

export function serializeLocalTransaction<T>(operation: () => Promise<T>) {
  const transaction = transactionTail.then(operation);
  transactionTail = transaction.then(
    () => undefined,
    () => undefined,
  );
  return transaction;
}

export async function persistLocalDatabase() {
  if (Capacitor.getPlatform() === 'web' && sqliteConnection) {
    await sqliteConnection.saveToStore(LOCAL_DATABASE_NAME);
  }
}

export async function closeLocalDatabase() {
  const database = await connectionPromise;
  if (!database || !sqliteConnection) return;
  await persistLocalDatabase();
  if ((await database.isDBOpen()).result) await database.close();
  await sqliteConnection.closeConnection(LOCAL_DATABASE_NAME, false);
  connectionPromise = undefined;
  sqliteConnection = undefined;
}
