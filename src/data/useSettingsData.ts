import { useCallback, useEffect, useRef, useState } from 'react';
import { useReconnect } from './reconnectContext';
import {
  checkForAppUpdate,
  installAvailableUpdate,
  isUpdateChannelConfigured,
  readInstalledAppInfo,
  type InstalledAppInfo,
  type UpdateManifest,
} from './appUpdate.ts';
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

export function useSettingsData(options: { hasUnfinishedCart: boolean }) {
  const reconnect = useReconnect();
  const [settings, setSettings] = useState<TerminalSettings>();
  const loaded = useRef(false);
  const [isTestingPrinter, setIsTestingPrinter] = useState(false);
  const [isInstallingPrinterLogo, setIsInstallingPrinterLogo] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isInstallingUpdate, setIsInstallingUpdate] = useState(false);
  const [installedApp, setInstalledApp] = useState<InstalledAppInfo | null>(null);
  const [pendingManifest, setPendingManifest] = useState<UpdateManifest | null>(
    null,
  );
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
    void readInstalledAppInfo()
      .then(setInstalledApp)
      .catch(() => setInstalledApp(null));
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
      if (afterSales.pendingSyncCount > 0) {
        setError(
          afterSales.lastSyncError
          ?? `${afterSales.pendingSyncCount} saved order${afterSales.pendingSyncCount === 1 ? '' : 's'} still need synchronization.`,
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

  const checkUpdate = useCallback(async () => {
    setIsCheckingUpdate(true);
    setError('');
    setMessage('');
    setPendingManifest(null);
    try {
      const availability = await checkForAppUpdate();
      if (availability.status === 'available') {
        setPendingManifest(availability.manifest);
        setMessage(
          `Version ${availability.manifest.versionName} is ready to install.`,
        );
      } else {
        setMessage('No update available.');
      }
    } catch {
      setError('');
      setMessage('No update available.');
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  const installUpdate = useCallback(async () => {
    if (!pendingManifest) {
      setError('Check for an update before installing.');
      return;
    }
    setIsInstallingUpdate(true);
    setError('');
    setMessage('');
    try {
      await installAvailableUpdate(pendingManifest, {
        hasUnfinishedCart: options.hasUnfinishedCart,
      });
      setMessage(
        'Android will ask you to confirm the update. The app restarts after installation.',
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Update installation could not start.',
      );
    } finally {
      setIsInstallingUpdate(false);
    }
  }, [options.hasUnfinishedCart, pendingManifest]);

  const dismissUpdate = useCallback(() => {
    setPendingManifest(null);
    setMessage('Update postponed. You can check again later.');
    setError('');
  }, []);

  return {
    settings,
    isLoading: !settings,
    isSyncing: reconnect.isSyncing,
    isTestingPrinter,
    isInstallingPrinterLogo,
    isCheckingUpdate,
    isInstallingUpdate,
    installedApp,
    updateChannelConfigured: isUpdateChannelConfigured(),
    pendingManifest,
    message,
    error,
    syncError: settings?.lastSyncError || '',
    save,
    syncNow,
    testPrinter,
    installPrinterLogo,
    checkUpdate,
    installUpdate,
    dismissUpdate,
  };
}
