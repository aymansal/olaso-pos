import {
  useMutation,
  useQuery_experimental as useQuery,
} from 'convex/react';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import {
  completeLocalSale,
  syncPendingSales,
  type CompleteSaleInput,
  type SaleSyncPayload,
} from './localSales.ts';
import { attemptSaleReceiptPrint } from './receiptPrinting.ts';
import {
  loadOperationalCache,
  replaceOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache.ts';
import { useStaffSession } from './sessionContext';
import { loadTerminalSettings, type ReceiptLanguage } from './terminalSettings';

export function toConvexSaleArgs(input: SaleSyncPayload) {
  return {
    ...input,
    lines: input.lines.map(({ recipeVersionId, ...line }) => ({
      ...line,
      productId: line.productId as Id<'products'>,
      ...(recipeVersionId
        ? {
            recipeVersionId: recipeVersionId as Id<'recipeVersions'>,
          }
        : {}),
      modifierOptionIds: line.modifierOptionIds.map(
        (id) => id as Id<'modifierOptions'>,
      ),
    })),
  };
}

export function usePosData() {
  const session = useStaffSession();
  const snapshotQuery = useQuery({
    query: api.sync.getOperationalSnapshot,
    args: { sessionToken: session.token, deviceId: session.deviceId },
  });
  const acceptMutation = useMutation(api.sales.accept);
  const [menu, setMenu] = useState<OperationalCacheSnapshot>();
  const [localError, setLocalError] = useState('');
  const [printFeedback, setPrintFeedback] = useState<{
    kind: 'neutral' | 'error' | 'success';
    message: string;
  }>();
  const [receiptLanguage, setReceiptLanguage] = useState<ReceiptLanguage>('en');
  const cloudSnapshot =
    snapshotQuery.status === 'success' ? snapshotQuery.data : undefined;

  const acceptSale = useCallback(
    async (input: SaleSyncPayload) => {
      const result = await acceptMutation({
        ...toConvexSaleArgs(input),
        sessionToken: session.token,
      });
      return {
        saleId: String(result.saleId),
        acknowledgedAt: result.acknowledgedAt,
      };
    },
    [acceptMutation, session.token],
  );

  const reloadLocal = useCallback(async () => {
    const cached = await loadOperationalCache();
    setMenu(cached);
    return cached;
  }, []);

  useEffect(() => {
    reloadLocal().catch((error: unknown) =>
      setLocalError(
        error instanceof Error ? error.message : 'Local menu loading failed.',
      ),
    );
  }, [reloadLocal]);

  useEffect(() => {
    loadTerminalSettings()
      .then((settings) => setReceiptLanguage(settings.receiptLanguage))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!cloudSnapshot) return;
    let active = true;
    const snapshot: OperationalCacheSnapshot = {
      ...cloudSnapshot,
      products: cloudSnapshot.products.map((product) => ({
        ...product,
        status: product.status === 'active' ? 'active' : 'unavailable',
      })),
    };
    (async () => {
      try {
        const sync = await syncPendingSales(acceptSale);
        if (sync.failed === 0) await replaceOperationalCache(snapshot);
        if (active) {
          await reloadLocal();
          setLocalError(
            sync.failed > 0
              ? 'Saved orders are waiting to synchronize.'
              : '',
          );
        }
      } catch (error) {
        if (active) {
          await reloadLocal();
          setLocalError(
            error instanceof Error
              ? error.message
              : 'Menu synchronization failed.',
          );
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [acceptSale, cloudSnapshot, reloadLocal]);

  useEffect(() => {
    const retry = () => {
      syncPendingSales(acceptSale)
        .then(reloadLocal)
        .catch((error: unknown) =>
          setLocalError(
            error instanceof Error
              ? error.message
              : 'Order synchronization failed.',
          ),
        );
    };
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [acceptSale, reloadLocal]);

  const completeOrder = useCallback(
    async (input: CompleteSaleInput) => {
      setPrintFeedback(undefined);
      const result = await completeLocalSale(input);
      setPrintFeedback({
        kind: 'neutral',
        message: 'Sale saved. Sending receipt…',
      });
      void (async () => {
        const outcome = await attemptSaleReceiptPrint(result);
        setPrintFeedback({
          kind: outcome.state === 'printed' ? 'success' : 'error',
          message: `Sale saved. ${outcome.message}`,
        });
      })();
      void reloadLocal().catch(() =>
        setLocalError('The order is saved locally. Menu refresh failed.'),
      );
      syncPendingSales(acceptSale)
        .then(reloadLocal)
        .catch(() =>
          setLocalError('The order is saved locally and waiting to synchronize.'),
        );
      return result;
    },
    [acceptSale, reloadLocal],
  );

  return {
    menu,
    completeOrder,
    printFeedback,
    isLoading: !menu,
    error:
      localError
      || (
        snapshotQuery.status === 'error'
          ? 'Cloud unavailable. Using the saved menu; local orders will retry automatically.'
          : undefined
      ),
    receiptLanguage,
  };
}
