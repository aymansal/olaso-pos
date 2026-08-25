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
import {
  buildOperationalBackup,
  assertBackupHasNoSecrets,
  parseOperationalBackup,
  summarizeOperationalBackup,
} from './operationalExport.ts';
import { openTextDocument, saveTextDocument } from './documentExport.ts';

export function useSettingsData() {
  const reconnect = useReconnect();
  const [settings, setSettings] = useState<TerminalSettings>();
  const loaded = useRef(false);
  const [isTestingPrinter, setIsTestingPrinter] = useState(false);
  const [isInstallingPrinterLogo, setIsInstallingPrinterLogo] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [isVerifyingBackup, setIsVerifyingBackup] = useState(false);
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

  const exportBackup = useCallback(async () => {
    setIsExportingBackup(true);
    setError('');
    setMessage('');
    try {
      const pendingBefore = (await refresh()).pendingSyncCount;
      const backup = await buildOperationalBackup();
      const text = JSON.stringify(backup);
      assertBackupHasNoSecrets(text);
      const stamp = backup.exportedAt.slice(0, 10);
      const result = await saveTextDocument(
        `olaso-backup-${stamp}.json`,
        text,
      );
      const pendingAfter = (await refresh()).pendingSyncCount;
      if (pendingAfter !== pendingBefore) {
        throw new Error('Pending sales changed during export. Try again.');
      }
      setMessage(
        `Backup saved (${result.bytesWritten} bytes, ${backup.counts.sales} sales, ${pendingAfter} still waiting to sync).`,
      );
    } catch (caught) {
      if (caught && typeof caught === 'object' && 'code' in caught && caught.code === 'CANCELLED') {
        setMessage('Export cancelled.');
        return;
      }
      setError(
        caught instanceof Error
          ? caught.message
          : 'The operational backup could not be exported.',
      );
      throw caught;
    } finally {
      setIsExportingBackup(false);
    }
  }, [refresh]);

  const verifyBackup = useCallback(async () => {
    setIsVerifyingBackup(true);
    setError('');
    setMessage('');
    try {
      const opened = await openTextDocument();
      assertBackupHasNoSecrets(opened.text);
      const backup = parseOperationalBackup(opened.text);
      const summary = summarizeOperationalBackup(backup);
      setMessage(
        `Backup verified: ${summary.counts.sales ?? 0} sales (${summary.pendingSales} unsynced), ${summary.counts.products ?? 0} products, device ${summary.deviceId}.`,
      );
    } catch (caught) {
      if (caught && typeof caught === 'object' && 'code' in caught && caught.code === 'CANCELLED') {
        setMessage('Backup open cancelled.');
        return;
      }
      setError(
        caught instanceof Error
          ? caught.message
          : 'The backup file could not be verified.',
      );
      throw caught;
    } finally {
      setIsVerifyingBackup(false);
    }
  }, []);

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
    isExportingBackup,
    isVerifyingBackup,
    message,
    error,
    syncError: settings?.lastSyncError || '',
    save,
    syncNow,
    testPrinter,
    installPrinterLogo,
    exportBackup,
    verifyBackup,
  };
}
