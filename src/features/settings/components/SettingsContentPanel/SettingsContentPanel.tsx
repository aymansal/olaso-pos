import {
  CheckCircle,
  CloudArrowUp,
  Database,
  DeviceTablet,
  Info,
  WarningCircle,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type {
  TerminalPreferences,
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
  online: boolean;
  message: string;
  error: string;
  onSave: (input: TerminalPreferences) => Promise<void>;
  onSync: () => Promise<void>;
}

export function SettingsContentPanel({
  section,
  settings,
  isLoading,
  isSyncing,
  online,
  message,
  error,
  onSave,
  onSync,
}: SettingsContentPanelProps) {
  const [terminalName, setTerminalName] = useState('');
  const [clockFormat, setClockFormat] =
    useState<TerminalPreferences['clockFormat']>('24-hour');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setTerminalName(settings.terminalName);
    setClockFormat(settings.clockFormat);
  }, [settings]);

  async function save() {
    setIsSaving(true);
    try {
      await onSave({ terminalName, clockFormat });
    } catch {
      // The data hook owns the actionable error message.
    } finally {
      setIsSaving(false);
    }
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
            <p>Review local work and synchronize this tablet</p>
          </div>
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
            Each click processes at most 10 saved sales. Retrying the same sale
            uses its existing device and local sale IDs, so it cannot duplicate
            the order.
          </p>
        </div>

        <Feedback message={message} error={error} />
      </section>
    );
  }

  if (section === 'about') {
    return (
      <section className={styles.panel} aria-labelledby="about-heading">
        <div className={styles.header}>
          <div>
            <h2 id="about-heading">About this beta</h2>
            <p>Current terminal scope and pending production decisions</p>
          </div>
        </div>
        <div className={styles.aboutLead}>
          <span className={styles.olasoMark}>O</span>
          <div>
            <strong>Olaso POS</strong>
            <span>Functional application beta · 0.1.0</span>
          </div>
        </div>
        <dl className={styles.aboutList}>
          <div>
            <dt>Operational record</dt>
            <dd>Local SQLite with idempotent Convex synchronization</dd>
          </div>
          <div>
            <dt>Authentication</dt>
            <dd>Not configured; owner role and PIN decisions are pending</dd>
          </div>
          <div>
            <dt>Receipts</dt>
            <dd>Saved snapshots and on-screen preview only</dd>
          </div>
          <div>
            <dt>Printer integration</dt>
            <dd>Not included in this beta</dd>
          </div>
        </dl>
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
