import { useCallback, useEffect, useRef, useState } from 'react';
import { useReconnect } from './reconnectContext';
import {
  loadTerminalSettings,
  savePrinterPreferences,
  saveTerminalPreferences,
  type PrinterPreferences,
  type TerminalPreferences,
  type TerminalSettings,
} from './terminalSettings.ts';
import {
  describePrinterFailure,
  testPrinterConnection,
} from '../printing/testPrinter.ts';
import { installResidentLogo } from '../printing/printerTransport.ts';

export function useSettingsData() {
  const reconnect = useReconnect();
  const [settings, setSettings] = useState<TerminalSettings>();
  const loaded = useRef(false);
  const [isTestingPrinter, setIsTestingPrinter] = useState(false);
  const [isInstallingPrinterLogo, setIsInstallingPrinterLogo] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const next = await loadTerminalSettings();
    setSettings(next);
    return next;
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    void refresh().then(() => { loaded.current = true; }).catch((caught: unknown) =>
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
    setError('');
    setMessage('');
    try {
      const result = await reconnect.run('manual');
      const afterSales = await refresh();
      if (result.failed > 0 || result.pending > 0) {
        setError(
          afterSales.lastSyncError
          ?? `${result.pending} saved order${result.pending === 1 ? '' : 's'} still need synchronization.`,
        );
        return;
      }
      setMessage(
        result.synced > 0
          ? `${result.synced} saved order${result.synced === 1 ? '' : 's'} and the menu synchronized.`
          : 'Menu and synchronization state are up to date.',
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Synchronization failed. Try again.',
      );
      await refresh().catch(() => undefined);
    }
  }, [reconnect, refresh]);

  const testPrinter = useCallback(
    async (input: PrinterPreferences) => {
      setIsTestingPrinter(true);
      setError('');
      setMessage('');
      try {
        const printer = await savePrinterPreferences(input);
        await refresh();
        const result = await testPrinterConnection(printer);
        setMessage(
          `Test data sent (${result.bytesWritten} bytes in ${result.totalMs} ms). Confirm paper.`,
        );
      } catch (caught) {
        const printerError = describePrinterFailure(caught);
        setError(printerError);
        throw caught;
      } finally {
        setIsTestingPrinter(false);
      }
    },
    [refresh],
  );

  const installPrinterLogo = useCallback(
    async (input: PrinterPreferences) => {
      setIsInstallingPrinterLogo(true);
      setError('');
      setMessage('');
      try {
        const printer = await savePrinterPreferences(input);
        await refresh();
        const result = await installResidentLogo({
          host: printer.printerHost,
          port: printer.printerPort,
        });
        setMessage(
          `Logo setup data sent (${result.bytesWritten} bytes in ${result.totalMs} ms). Print a receipt to confirm the saved logo.`,
        );
      } catch (caught) {
        const printerError = describePrinterFailure(caught);
        setError(printerError);
        throw caught;
      } finally {
        setIsInstallingPrinterLogo(false);
      }
    },
    [refresh],
  );

  return {
    settings,
    isLoading: !settings,
    isSyncing: reconnect.isSyncing,
    isTestingPrinter,
    isInstallingPrinterLogo,
    message,
    error,
    syncError: settings?.lastSyncError || '',
    save,
    syncNow,
    testPrinter,
    installPrinterLogo,
  };
}
