import {
  ArrowClockwise,
  CheckCircle,
  CloudArrowUp,
  Database,
  DeviceTablet,
  ImageSquare,
  Info,
  Printer as PrinterIcon,
  WarningCircle,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type { InstalledAppInfo } from '../../../../data/appUpdate';
import type {
  TerminalPreferences,
  PrinterPreferences,
  TerminalSettings,
} from '../../../../data/terminalSettings';
import type { SettingsSection } from '../SettingsNavigationPanel/SettingsNavigationPanel';
import styles from './SettingsContentPanel.module.css';

function formatTimestamp(value?: number) {
  if (!value) return 'Not yet';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

interface SettingsContentPanelProps {
  section: SettingsSection;
  settings?: TerminalSettings;
  isLoading: boolean;
  isSyncing: boolean;
  isTestingPrinter: boolean;
  isInstallingPrinterLogo: boolean;
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
  onSync: () => Promise<void>;
  onTestPrinter: (input: PrinterPreferences) => Promise<void>;
  onInstallPrinterLogo: (input: PrinterPreferences) => Promise<void>;
  onCheckUpdate: () => Promise<void>;
  onInstallUpdate: () => Promise<void>;
  onDismissUpdate: () => void;
}

export function SettingsContentPanel({
  section,
  settings,
  isLoading,
  isSyncing,
  isTestingPrinter,
  isInstallingPrinterLogo,
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
  onSync,
  onTestPrinter,
  onInstallPrinterLogo,
  onCheckUpdate,
  onInstallUpdate,
  onDismissUpdate,
}: SettingsContentPanelProps) {
  const [terminalName, setTerminalName] = useState('');
  const [clockFormat, setClockFormat] =
    useState<TerminalPreferences['clockFormat']>('24-hour');
  const [receiptLanguage, setReceiptLanguage] =
    useState<TerminalPreferences['receiptLanguage']>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [printerHost, setPrinterHost] = useState('');
  const [printerPort, setPrinterPort] = useState('9100');

  useEffect(() => {
    if (!settings) return;
    setTerminalName(settings.terminalName);
    setClockFormat(settings.clockFormat);
    setReceiptLanguage(settings.receiptLanguage);
    setPrinterHost(settings.printerHost);
    setPrinterPort(String(settings.printerPort));
  }, [settings]);

  async function save() {
    setIsSaving(true);
    try {
      await onSave({ terminalName, clockFormat, receiptLanguage });
    } catch {
      // The data hook owns the actionable error message.
    } finally {
      setIsSaving(false);
    }
  }

  async function testPrinter() {
    try {
      await onTestPrinter({
        printerHost,
        printerPort: Number(printerPort),
      });
    } catch {
      // The data hook owns the actionable error message.
    }
  }

  async function installPrinterLogo() {
    const approved = window.confirm(
      'This replaces every image saved in the printer. Continue only during printer setup.',
    );
    if (!approved) return;
    try {
      await onInstallPrinterLogo({
        printerHost,
        printerPort: Number(printerPort),
      });
    } catch {
      // The data hook owns the actionable error message.
    }
  }

  if (section === 'printer') {
    const printerBusy = isTestingPrinter || isInstallingPrinterLogo;
    return (
      <section className={styles.panel} aria-labelledby="printer-heading">
        <div className={styles.header}>
          <div>
            <h2 id="printer-heading">Printer & hardware</h2>
            <p>Configure this tablet's Ethernet receipt printer</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={`${styles.primary} ${styles.secondary}`}
              type="button"
              disabled={printerBusy || isLoading}
              onClick={installPrinterLogo}
            >
              <ImageSquare size={17} aria-hidden="true" />
              <span>{isInstallingPrinterLogo ? 'Restoring…' : 'Restore saved logo'}</span>
            </button>
            <button
              className={styles.primary}
              type="button"
              disabled={printerBusy || isLoading}
              onClick={testPrinter}
            >
              <PrinterIcon size={17} aria-hidden="true" />
              <span>{isTestingPrinter ? 'Testing…' : 'Test printer'}</span>
            </button>
          </div>
        </div>

        <div className={styles.identity}>
          <span className={styles.deviceIcon}>
            <PrinterIcon size={24} aria-hidden="true" />
          </span>
          <div>
            <span>LAN receipt printer</span>
            <strong>
              {settings?.printerHost
                ? `${settings.printerHost}:${settings.printerPort}`
                : 'Not configured'}
            </strong>
            <small>USB remains a separate desktop receipt-lab path.</small>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label>
            <span>Printer IPv4 address</span>
            <input
              value={printerHost}
              inputMode="decimal"
              autoComplete="off"
              placeholder="192.168.1.100"
              disabled={isLoading || printerBusy}
              onChange={(event) => setPrinterHost(event.target.value)}
            />
            <small>Use the address reserved on the installation router.</small>
          </label>
          <label>
            <span>Raw TCP port</span>
            <input
              value={printerPort}
              inputMode="numeric"
              autoComplete="off"
              disabled={isLoading || printerBusy}
              onChange={(event) => setPrinterPort(event.target.value)}
            />
            <small>The verified WD8260 lab endpoint uses port 9100.</small>
          </label>
        </div>

        <div className={`${styles.notice} ${styles.printerNotice}`}>
          <Info size={18} aria-hidden="true" />
          <p>
            Test printer sends a marked non-sale diagnostic. Restore saved logo
            replaces every image stored in the printer with the approved OLASO
            logo. A completed TCP write does not confirm paper or logo storage;
            inspect a receipt separately.
          </p>
        </div>

        <Feedback message={message} error={error} />
      </section>
    );
  }

  if (section === 'sync') {
    const syncLabel = error
      ? 'Needs attention'
      : settings?.pendingSyncCount
        ? `${settings.pendingSyncCount} waiting`
        : settings?.lastSyncAt
          ? 'Up to date'
          : 'Not synced yet';

    return (
      <section className={styles.panel} aria-labelledby="sync-heading">
        <div className={styles.header}>
          <div>
            <h2 id="sync-heading">Data & sync</h2>
            <p>Review local work and synchronize with the cloud</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.primary}
              type="button"
              disabled={isSyncing || !online || isLoading}
              onClick={onSync}
            >
              <CloudArrowUp size={17} aria-hidden="true" />
              <span>{isSyncing ? 'Syncing…' : 'Sync now'}</span>
            </button>
          </div>
        </div>

        <div className={styles.statusHero}>
          <span className={styles.statusIcon}>
            {error
              ? <WarningCircle size={24} aria-hidden="true" />
              : <CheckCircle size={24} aria-hidden="true" />}
          </span>
          <div>
            <span>Synchronization state</span>
            <strong>{syncLabel}</strong>
            <small>
              {online
                ? 'This action sends saved sales before refreshing menu data.'
                : 'Reconnect to use Sync now. Local checkout remains available.'}
            </small>
          </div>
        </div>

        <div className={styles.metrics}>
          <article>
            <span>Connection</span>
            <strong>{online ? 'Online' : 'Offline'}</strong>
          </article>
          <article>
            <span>Waiting sales</span>
            <strong>{settings?.pendingSyncCount ?? '—'}</strong>
          </article>
          <article>
            <span>Last successful sync</span>
            <strong>{formatTimestamp(settings?.lastSyncAt)}</strong>
          </article>
        </div>

        <div className={styles.detailList}>
          <div>
            <Database size={18} aria-hidden="true" />
            <span>
              <strong>Saved operational menu</strong>
              <small>{formatTimestamp(settings?.menuUpdatedAt)}</small>
            </span>
          </div>
          <div>
            <DeviceTablet size={18} aria-hidden="true" />
            <span>
              <strong>Device ID</strong>
              <small>{settings?.deviceId ?? 'Loading…'}</small>
            </span>
          </div>
        </div>

        <div className={styles.notice}>
          <Info size={18} aria-hidden="true" />
          <p>
            Online tablets synchronize saved work automatically while the app is
            open. Sync now retries failed rows and processes at most 10 saved
            sales per click without duplicating orders. Convex keeps the
            synchronized cloud copy for this shop.
          </p>
        </div>

        <Feedback message={message} error={error} />
      </section>
    );
  }

  if (section === 'about') {
    const versionLabel = installedApp
      ? `${installedApp.versionName} (${installedApp.versionCode})`
      : '0.1.0-rc.4';
    return (
      <section className={styles.panel} aria-labelledby="about-heading">
        <div className={styles.header}>
          <div>
            <h2 id="about-heading">About Olaso</h2>
            <p>Installed version and guided tablet updates</p>
          </div>
        </div>
        <div className={styles.aboutLead}>
          <span className={styles.olasoMark}>O</span>
          <div>
            <strong>Olaso POS</strong>
            <span>Release candidate · {versionLabel}</span>
          </div>
        </div>
        <div className={styles.updateBlock}>
          <p>
            {updateChannelConfigured
              ? 'You can check anytime. If nothing is published for the shop, Olaso simply says no update is available. When a release is open, choose Update or Later. Android confirms installation. An open order blocks Update.'
              : 'This build has no HTTPS update channel configured. Signed releases still install with the same application ID and signing key.'}
          </p>
          <div className={styles.updateActions}>
            <button
              className={styles.primary}
              type="button"
              disabled={
                isCheckingUpdate ||
                isInstallingUpdate ||
                !updateChannelConfigured ||
                !online
              }
              onClick={() => void onCheckUpdate()}
            >
              <ArrowClockwise size={17} aria-hidden="true" />
              <span>
                {isCheckingUpdate ? 'Checking…' : 'Check for update'}
              </span>
            </button>
            {pendingUpdateVersion ? (
              <>
                <button
                  className={styles.primary}
                  type="button"
                  disabled={
                    isInstallingUpdate ||
                    isCheckingUpdate ||
                    hasUnfinishedCart
                  }
                  onClick={() => void onInstallUpdate()}
                >
                  <CheckCircle size={17} aria-hidden="true" />
                  <span>
                    {isInstallingUpdate
                      ? 'Starting…'
                      : `Update to ${pendingUpdateVersion}`}
                  </span>
                </button>
                <button
                  className={`${styles.primary} ${styles.secondary}`}
                  type="button"
                  disabled={isInstallingUpdate}
                  onClick={onDismissUpdate}
                >
                  Later
                </button>
              </>
            ) : null}
          </div>
          {hasUnfinishedCart && pendingUpdateVersion ? (
            <p className={styles.updateHint}>
              Finish or clear the open order before installing an update.
            </p>
          ) : null}
        </div>
        <dl className={styles.aboutList}>
          <div>
            <dt>Operational record</dt>
            <dd>Local SQLite with idempotent Convex synchronization</dd>
          </div>
          <div>
            <dt>Authentication</dt>
            <dd>Separate staff PINs with protected offline tablet access</dd>
          </div>
          <div>
            <dt>Receipts</dt>
            <dd>Saved snapshots with printing and safe reprinting</dd>
          </div>
          <div>
            <dt>Printer integration</dt>
            <dd>LAN checkout printing, diagnostics, and saved-logo setup</dd>
          </div>
        </dl>
        <Feedback message={message} error={error} />
      </section>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="general-heading">
      <div className={styles.header}>
        <div>
          <h2 id="general-heading">General</h2>
          <p>Name this terminal and choose its local time display</p>
        </div>
        <button
          className={styles.primary}
          type="button"
          disabled={isSaving || isLoading}
          onClick={save}
        >
          <CheckCircle size={17} aria-hidden="true" />
          <span>{isSaving ? 'Saving…' : 'Save settings'}</span>
        </button>
      </div>

      <div className={styles.identity}>
        <span className={styles.deviceIcon}>
          <DeviceTablet size={24} aria-hidden="true" />
        </span>
        <div>
          <span>This tablet</span>
          <strong>{settings?.terminalName ?? 'Loading settings…'}</strong>
          <small>Device identity stays fixed after the first local setup.</small>
        </div>
      </div>

      <div className={styles.formGrid}>
        <label>
          <span>Terminal name</span>
          <input
            value={terminalName}
            maxLength={40}
            disabled={isLoading}
            onChange={(event) => setTerminalName(event.target.value)}
          />
          <small>Shown on the local lock screen.</small>
        </label>
        <label>
          <span>Device ID</span>
          <input value={settings?.deviceId ?? ''} readOnly />
          <small>Read-only to preserve sale retry identity.</small>
        </label>
      </div>

      <fieldset className={styles.clock}>
        <legend>Clock format</legend>
        <p>Used on the local terminal lock screen.</p>
        <div>
          {(['12-hour', '24-hour'] as const).map((value) => (
            <button
              className={clockFormat === value ? styles.selected : ''}
              type="button"
              aria-pressed={clockFormat === value}
              onClick={() => setClockFormat(value)}
              key={value}
            >
              {value === '12-hour' ? '12 hour' : '24 hour'}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.language}>
        <legend>Receipt language</legend>
        <p>Each new saved receipt and print follows this staff-app language.</p>
        <div>
          {(['en', 'fr'] as const).map((value) => (
            <button
              className={receiptLanguage === value ? styles.selected : ''}
              type="button"
              aria-pressed={receiptLanguage === value}
              onClick={() => setReceiptLanguage(value)}
              key={value}
            >
              {value === 'en' ? 'English' : 'Français'}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.notice}>
        <Info size={18} aria-hidden="true" />
        <p>
          These preferences stay only on this tablet. They contain no password,
          PIN, cloud secret, or production login policy.
        </p>
      </div>

      <Feedback message={message} error={error} />
    </section>
  );
}

function Feedback({ message, error }: { message: string; error: string }) {
  if (!message && !error) return null;
  return (
    <p className={`${styles.feedback} ${error ? styles.feedbackError : ''}`} role={error ? 'alert' : 'status'}>
      {error || message}
    </p>
  );
}
