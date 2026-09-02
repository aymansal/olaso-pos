import { useCallback, useEffect, useRef, useState } from 'react';
import {
  completeLocalSale,
  type CompleteSaleInput,
} from './localSales.ts';
import { attemptSaleReceiptPrint } from './receiptPrinting.ts';
import {
  loadOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache.ts';
import { topSellingProductIds } from './offlineViews.ts';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';

export function usePosData() {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [menu, setMenu] = useState<OperationalCacheSnapshot>();
  const [quickAddProductIds, setQuickAddProductIds] = useState<string[]>([]);
  const [localError, setLocalError] = useState('');
  const [printFeedback, setPrintFeedback] = useState<{
    kind: 'neutral' | 'error' | 'success';
    message: string;
  }>();
  const loadedRevision = useRef<number | undefined>(undefined);
  const reloadLocal = useCallback(async () => {
    const [cached, quickAdd] = await Promise.all([
      loadOperationalCache(),
      topSellingProductIds(),
    ]);
    setMenu(cached);
    setQuickAddProductIds(quickAdd);
    return cached;
  }, []);

  useEffect(() => {
    if (loadedRevision.current === reconnect.revision) return;
    void reloadLocal().then(() => {
      loadedRevision.current = reconnect.revision;
    }).catch((error: unknown) =>
      setLocalError(
        error instanceof Error ? error.message : 'Local menu loading failed.',
      ),
    );
  }, [reconnect.revision, reloadLocal]);

  const completeOrder = useCallback(
    async (input: Omit<CompleteSaleInput, 'cashierName' | 'cashierProfileId'>) => {
      setPrintFeedback(undefined);
      const result = await completeLocalSale({
        ...input,
        cashierProfileId: session.staffProfileId,
        cashierName: session.name,
      });
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
      reconnect.notifyLocalWrite();
      void reconnect.run('automatic').catch(() =>
        setLocalError('The order is saved locally and waiting to synchronize.'),
      );
      return result;
    },
    [reconnect, reloadLocal, session.name],
  );

  return {
    menu,
    quickAddProductIds,
    completeOrder,
    printFeedback,
    isLoading: !menu,
    error: localError || undefined,
  };
}
