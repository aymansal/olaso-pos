import { useCallback, useEffect, useState } from 'react';
import {
  completeLocalSale,
  type CompleteSaleInput,
} from './localSales.ts';
import { attemptSaleReceiptPrint } from './receiptPrinting.ts';
import {
  loadOperationalCache,
  type OperationalCacheSnapshot,
} from './operationalCache.ts';
import { useReconnect } from './reconnectContext';
import { useStaffSession } from './sessionContext';
import { loadTerminalSettings, type ReceiptLanguage } from './terminalSettings';

export function usePosData() {
  const session = useStaffSession();
  const reconnect = useReconnect();
  const [menu, setMenu] = useState<OperationalCacheSnapshot>();
  const [localError, setLocalError] = useState('');
  const [printFeedback, setPrintFeedback] = useState<{
    kind: 'neutral' | 'error' | 'success';
    message: string;
  }>();
  const [receiptLanguage, setReceiptLanguage] = useState<ReceiptLanguage>('en');
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
  }, [reconnect.revision, reloadLocal]);

  useEffect(() => {
    loadTerminalSettings()
      .then((settings) => setReceiptLanguage(settings.receiptLanguage))
      .catch(() => undefined);
  }, []);

  const completeOrder = useCallback(
    async (input: Omit<CompleteSaleInput, 'cashierName'>) => {
      setPrintFeedback(undefined);
      const result = await completeLocalSale({
        ...input,
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
      void reconnect.run('automatic').catch(() =>
        setLocalError('The order is saved locally and waiting to synchronize.'),
      );
      return result;
    },
    [reconnect, reloadLocal, session.name],
  );

  return {
    menu,
    completeOrder,
    printFeedback,
    isLoading: !menu,
    error: localError || undefined,
    receiptLanguage,
  };
}
