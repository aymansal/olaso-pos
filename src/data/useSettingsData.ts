import { useConvex, useMutation } from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import {
  syncPendingSales,
  type SaleSyncPayload,
} from './localSales.ts';
import { makePendingOutboxAvailable } from './outbox.ts';
import { replaceOperationalCache } from './operationalCache.ts';
import {
  loadTerminalSettings,
  recordSyncFailure,
  saveTerminalPreferences,
  type TerminalPreferences,
  type TerminalSettings,
} from './terminalSettings.ts';

function toConvexSaleArgs(input: SaleSyncPayload) {
  return {
    ...input,
    lines: input.lines.map(({ recipeVersionId, ...line }) => ({
      ...line,
      productId: line.productId as Id<'products'>,
      ...(recipeVersionId
        ? { recipeVersionId: recipeVersionId as Id<'recipeVersions'> }
        : {}),
      modifierOptionIds: line.modifierOptionIds.map(
        (id) => id as Id<'modifierOptions'>,
      ),
    })),
  };
}

export function useSettingsData() {
  const convex = useConvex();
  const acceptMutation = useMutation(api.sales.accept);
  const [settings, setSettings] = useState<TerminalSettings>();
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const next = await loadTerminalSettings();
    setSettings(next);
    return next;
  }, []);

  useEffect(() => {
    refresh().catch((caught: unknown) =>
      setError(
        caught instanceof Error
          ? caught.message
          : 'Local settings could not be loaded.',
      ),
    );
  }, [refresh]);

  const save = useCallback(
    async (input: TerminalPreferences) => {
      setError('');
      setMessage('');
      try {
        await saveTerminalPreferences(input);
        await refresh();
        setMessage('Settings saved on this tablet.');
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : 'Settings were not saved.',
        );
        throw caught;
      }
    },
    [refresh],
  );

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    setError('');
    setMessage('');
    try {
      await makePendingOutboxAvailable();
      const result = await syncPendingSales(async (input) => {
        const accepted = await acceptMutation(toConvexSaleArgs(input));
        return {
          saleId: String(accepted.saleId),
          acknowledgedAt: accepted.acknowledgedAt,
        };
      });
      const afterSales = await refresh();
      if (result.failed > 0) {
        throw new Error(
          afterSales.lastSyncError
          ?? 'Some saved orders still need synchronization.',
        );
      }
      if (afterSales.pendingSyncCount > 0) {
        setMessage(
          `${result.synced} order${result.synced === 1 ? '' : 's'} synced; `
          + `${afterSales.pendingSyncCount} remain. Sync again to continue.`,
        );
        return;
      }

      const cloud = await convex.query(api.sync.getOperationalSnapshot, {
        requestId: crypto.randomUUID(),
      });
      await replaceOperationalCache({
        ...cloud,
        products: cloud.products.map((product) => ({
          ...product,
          status: product.status === 'active' ? 'active' : 'unavailable',
        })),
      });
      await refresh();
      setMessage(
        result.synced > 0
          ? `${result.synced} saved order${result.synced === 1 ? '' : 's'} and the menu synchronized.`
          : 'Menu and synchronization state are up to date.',
      );
    } catch (caught) {
      const syncError = await recordSyncFailure(caught);
      setError(syncError);
      await refresh().catch(() => undefined);
    } finally {
      setIsSyncing(false);
    }
  }, [acceptMutation, convex, refresh]);

  return {
    settings,
    isLoading: !settings,
    isSyncing,
    message,
    error,
    syncError: settings?.lastSyncError || '',
    save,
    syncNow,
  };
}
