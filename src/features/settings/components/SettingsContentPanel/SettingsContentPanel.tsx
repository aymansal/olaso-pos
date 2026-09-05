import { RotateCw, CheckCircle, Cloud, Printer as PrinterIcon } from '@boxicons/react';
import { useEffect, useState } from 'react';
import type { InstalledAppInfo } from '../../../../data/appUpdate';
import type {
  TerminalPreferences,
  PrinterPreferences,
  TerminalSettings,
} from '../../../../data/terminalSettings';
import {
  formatPrinterEndpoint,
  parsePrinterEndpoint,
} from '../../../../data/terminalSettings';
import { useLanguage, useT } from '../../../../lib/locale';
import { MenuSelect } from '../../../../components/MenuSelect/MenuSelect';
import styles from './SettingsContentPanel.module.css';

function formatTimestamp(value: number | undefined, language: 'en' | 'fr') {
  if (!value) return undefined;
  return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

function localizeNotice(
  t: (english: string, vars?: Record<string, string | number>) => string,
  text: string,
) {
  const waiting = text.match(/^(\d+) saved orders? still need synchronization\.$/);
  if (waiting) {
    return waiting[1] === '1'
      ? t('1 saved order still needs synchronization.')
      : t('{count} saved orders still need synchronization.', { count: waiting[1] });
  }
  const synced = text.match(/^(\d+) saved orders? and the menu synchronized\.$/);
  if (synced) {
    return synced[1] === '1'
      ? t('1 saved order and the menu synchronized.')
      : t('{count} saved orders and the menu synchronized.', { count: synced[1] });
  }
  const test = text.match(/^Test data sent \((\d+) bytes in (\d+) ms\)\. Confirm paper\.$/);
  if (test) {
    return t('Test data sent ({bytes} bytes in {ms} ms). Confirm paper.', {
      bytes: test[1],
      ms: test[2],
    });
  }
  const version = text.match(/^Version (.+) is ready to install\.$/);
  if (version) {
    return t('Version {version} is ready to install.', { version: version[1] });
  }
  return t(text);
}

interface SettingsContentPanelProps {
  settings?: TerminalSettings;
  isLoading: boolean;
  isSyncing: boolean;
  isTestingPrinter: boolean;
  isCheckingUpdate: boolean;
  isInstallingUpdate: boolean;
  installedApp: InstalledAppInfo | null;
  updateChannelConfigured: boolean;
  pendingUpdateVersion: string | null;
  hasUnfinishedCart: boolean;
  online: boolean;
  message: string;
  error: string;
  onSave: (input: TerminalPreferences) => Promise<void>;
  onLanguageChange: (language: TerminalPreferences['applicationLanguage']) => Promise<void>;
  onSync: () => Promise<void>;
  onTestPrinter: (input: PrinterPreferences) => Promise<void>;
  onCheckUpdate: () => Promise<void>;
  onInstallUpdate: () => Promise<void>;
  onDismissUpdate: () => void;
}

export function SettingsContentPanel({
  settings,
  isLoading,
  isSyncing,
  isTestingPrinter,
  isCheckingUpdate,
  isInstallingUpdate,
  installedApp,
  updateChannelConfigured,
  pendingUpdateVersion,
  hasUnfinishedCart,
  online,
  message,
  error,
  onSave,
  onLanguageChange,
  onSync,
  onTestPrinter,
  onCheckUpdate,
  onInstallUpdate,
  onDismissUpdate,
}: SettingsContentPanelProps) {
  const t = useT();
  const language = useLanguage();
  const [clockFormat, setClockFormat] =
    useState<TerminalPreferences['clockFormat']>('24-hour');
  const [receiptLanguage, setReceiptLanguage] =
    useState<TerminalPreferences['receiptLanguage']>('en');
  const [printerEndpoint, setPrinterEndpoint] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setClockFormat(settings.clockFormat);
    setReceiptLanguage(settings.receiptLanguage);
    setPrinterEndpoint(
      formatPrinterEndpoint(settings.printerHost, settings.printerPort),
    );
  }, [settings]);

  async function savePreferences(
    next: Partial<Pick<TerminalPreferences, 'clockFormat' | 'receiptLanguage' | 'autoLockMinutes'>>,
  ) {
    if (!settings || saving) return;
    const clock = next.clockFormat ?? clockFormat;
    const receipt = next.receiptLanguage ?? receiptLanguage;
    setSaving(true);
    try { await onSave({
      terminalName: settings.terminalName,
      clockFormat: clock,
      receiptLanguage: receipt,
      applicationLanguage: language,
      autoLockMinutes: next.autoLockMinutes ?? settings.autoLockMinutes,
    });
      setClockFormat(clock);
      setReceiptLanguage(receipt);
    } catch {
      // Keep the last saved values; the data hook displays the save failure.
    } finally { setSaving(false); }
  }

  async function testPrinter() {
    try {
      const printer = parsePrinterEndpoint(printerEndpoint);
      setPrinterEndpoint(
        formatPrinterEndpoint(printer.printerHost, printer.printerPort),
      );
      await onTestPrinter(printer);
    } catch {
      // The data hook owns the actionable error message.
    }
  }

  const versionLabel = installedApp?.versionName ?? '1.1';
  const lastSync = formatTimestamp(settings?.lastSyncAt, language);

  return (
    <section className={styles.panel} aria-labelledby="settings-heading">
      <header className={styles.header}>
        <h1 id="settings-heading">{t('Settings')}</h1>
        <small>{t('Preferences and terminal controls')}</small>
      </header>

      <div className={styles.choices}>
        <fieldset className={styles.choice}>
          <legend>{t('Application')}</legend>
          <div>
            {(['en', 'fr'] as const).map((value) => (
              <button
                className={language === value ? styles.selected : ''}
                type="button"
                aria-pressed={language === value}
                disabled={isLoading || saving}
                onClick={() => void onLanguageChange(value)}
                key={`app-${value}`}
              >
                {value === 'en' ? t('English') : t('Français')}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.choice}>
          <legend>{t('Receipts')}</legend>
          <div>
            {(['en', 'fr'] as const).map((value) => (
              <button
                className={receiptLanguage === value ? styles.selected : ''}
                type="button"
                aria-pressed={receiptLanguage === value}
                disabled={isLoading || saving}
                onClick={() => void savePreferences({ receiptLanguage: value })}
                key={`receipt-${value}`}
              >
                {value === 'en' ? t('English') : t('Français')}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.choice}>
          <legend>{t('Clock')}</legend>
          <div>
            {(['12-hour', '24-hour'] as const).map((value) => (
              <button
                className={clockFormat === value ? styles.selected : ''}
                type="button"
                aria-pressed={clockFormat === value}
                disabled={isLoading || saving}
                onClick={() => void savePreferences({ clockFormat: value })}
                key={value}
              >
                {value === '12-hour' ? t('12 hour') : t('24 hour')}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.choice}>
          <legend>{t('Auto-lock')}</legend>
          <MenuSelect size="field" className={styles.autoLock} ariaLabel="Auto-lock"
            value={String(settings?.autoLockMinutes ?? 5)} disabled={isLoading || saving || !settings}
            onChange={(value) => void savePreferences({ autoLockMinutes: Number(value) as TerminalSettings['autoLockMinutes'] })}
            options={[
              { id: '5', label: '5 minutes' }, { id: '10', label: '10 minutes' },
              { id: '15', label: '15 minutes' }, { id: '30', label: '30 minutes' },
              { id: '0', label: 'Never' },
            ]}
          />
        </fieldset>
      </div>

      <section className={styles.printer} aria-labelledby="printer-heading">
        <header>
          <h2 id="printer-heading">{t('Printer')}</h2>
        </header>
        <div className={styles.printerRow}>
          <input
            aria-label={t('Printer address')}
            value={printerEndpoint}
            inputMode="decimal"
            autoComplete="off"
            placeholder="192.168.1.100:9100"
            disabled={isLoading || isTestingPrinter}
            onChange={(event) => setPrinterEndpoint(event.target.value)}
          />
          <button
            className={styles.primary}
            type="button"
            disabled={isTestingPrinter || isLoading}
            onClick={() => void testPrinter()}
          >
            <PrinterIcon width={16} height={16} aria-hidden="true" />
            <span>{isTestingPrinter ? t('Testing…') : t('Test printer')}</span>
          </button>
        </div>
      </section>

      <section className={styles.sync} aria-labelledby="sync-heading">
        <header>
          <span>
            <h2 id="sync-heading">{t('Sync')}</h2>
          </span>
          <button
            className={styles.primary}
            type="button"
            disabled={isSyncing || !online || isLoading}
            onClick={() => void onSync()}
          >
            <Cloud width={16} height={16} aria-hidden="true" />
            <span>{isSyncing ? t('Syncing…') : t('Sync now')}</span>
          </button>
        </header>
        <div className={styles.syncFacts}>
          <article>
            <small>{t('Connection')}</small>
            <strong>{online ? t('Online') : t('Offline')}</strong>
          </article>
          <article>
            <small>{t('Waiting sales')}</small>
            <strong>{settings?.pendingSyncCount ?? '—'}</strong>
          </article>
          <article>
            <small>{t('Last successful sync')}</small>
            <strong>{lastSync ?? t('Not yet')}</strong>
          </article>
        </div>
      </section>

      <section className={styles.update} aria-labelledby="update-heading">
        <header>
          <span>
            <h2 id="update-heading">{t('Update')}</h2>
            <small>{t('Olaso POS')} {versionLabel}</small>
          </span>
          <button
            className={styles.primary}
            type="button"
            disabled={
              isCheckingUpdate
              || isInstallingUpdate
              || !updateChannelConfigured
              || !online
            }
            onClick={() => void onCheckUpdate()}
          >
            <RotateCw width={16} height={16} aria-hidden="true" />
            <span>{isCheckingUpdate ? t('Checking…') : t('Check for update')}</span>
          </button>
        </header>
        {pendingUpdateVersion ? (
          <div className={styles.updateActions}>
            <button
              className={styles.primary}
              type="button"
              disabled={isInstallingUpdate || isCheckingUpdate || hasUnfinishedCart}
              onClick={() => void onInstallUpdate()}
            >
              <CheckCircle width={16} height={16} aria-hidden="true" />
              <span>
                {isInstallingUpdate
                  ? t('Starting…')
                  : t('Update to {version}', { version: pendingUpdateVersion })}
              </span>
            </button>
            <button
              className={styles.secondary}
              type="button"
              disabled={isInstallingUpdate}
              onClick={onDismissUpdate}
            >
              {t('Later')}
            </button>
            {hasUnfinishedCart ? (
              <p>{t('Finish or clear the open order before installing.')}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      {message || error ? (
        <p
          className={`${styles.feedback} ${error ? styles.feedbackError : ''}`}
          role={error ? 'alert' : 'status'}
        >
          {localizeNotice(t, error || message)}
        </p>
      ) : null}
    </section>
  );
}
