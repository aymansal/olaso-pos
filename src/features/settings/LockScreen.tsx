import { CheckCircle, LockKey, WifiHigh, WifiSlash } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type { TerminalSettings } from '../../data/terminalSettings';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  settings: TerminalSettings;
  onUnlock: () => Promise<void>;
}

export function LockScreen({ settings, onUnlock }: LockScreenProps) {
  const [now, setNow] = useState(new Date());
  const [online, setOnline] = useState(navigator.onLine);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  async function unlock() {
    setUnlocking(true);
    setError('');
    try {
      await onUnlock();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'This terminal could not be unlocked.',
      );
      setUnlocking(false);
    }
  }

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: settings.clockFormat === '12-hour',
  }).format(now);
  const date = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return (
    <main className={styles.screen}>
      <section className={styles.brandSide} aria-label="Olaso terminal">
        <span className={styles.largeShape} />
        <span className={styles.upperShape} />
        <div className={styles.wordmark}>
          <span />
          <strong>OLASO</strong>
        </div>
        <span className={styles.accent} />
        <div className={styles.brandMessage}>
          <h1>Every sale.<br />Every gram.</h1>
          <p>Your Olaso terminal is locked and ready for the next shift.</p>
        </div>
        <div className={styles.connection}>
          {online
            ? <WifiHigh size={14} aria-hidden="true" />
            : <WifiSlash size={14} aria-hidden="true" />}
          <span>{online ? 'Terminal online' : 'Terminal offline · local service ready'}</span>
        </div>
        <div className={styles.dateTime}>
          <span>{date.toUpperCase()}</span>
          <strong>{time}</strong>
          <small>{settings.terminalName} · local terminal</small>
        </div>
      </section>

      <section className={styles.unlockSide} aria-labelledby="unlock-title">
        <span className={styles.lockIcon}>
          <LockKey size={22} aria-hidden="true" />
        </span>
        <h2 id="unlock-title">Unlock Olaso</h2>
        <p className={styles.subtitle}>
          Continue this local terminal session.
        </p>

        <div className={styles.identity}>
          <span className={styles.identityMark}>O</span>
          <div>
            <strong>{settings.terminalName}</strong>
            <small>{settings.deviceId}</small>
          </div>
          <CheckCircle size={20} aria-hidden="true" />
        </div>

        <div className={styles.policy}>
          <span>LOCAL BETA LOCK</span>
          <p>
            PIN sign-in and staff roles are pending owner confirmation. This
            screen prevents accidental use; it does not authenticate a person.
          </p>
        </div>

        <button
          className={styles.unlock}
          type="button"
          disabled={unlocking}
          onClick={unlock}
        >
          {unlocking ? 'Unlocking…' : 'Continue to POS'}
        </button>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
      </section>
    </main>
  );
}
