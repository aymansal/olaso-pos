import { CheckCircle, LockKey, WifiHigh, WifiSlash } from '@phosphor-icons/react';
import { useAction, useConvex } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import {
  clearLegacyStaffSession,
  clearStaffSession,
  loadStaffSession,
  saveStaffSession,
  isServiceUnavailable,
  verifyOfflinePin,
  type StaffSession,
} from '../../data/identitySession';
import { readSecureSessionNetworkStatus } from '../../data/secureSession';
import { useConnectionStatus } from '../../data/connectionContext';
import {
  loadOperationalCache,
  reconcileAuthenticatedStaffProfiles,
  saveAuthenticatedStaffProfile,
} from '../../data/operationalCache';
import type { TerminalSettings } from '../../data/terminalSettings';
import { isStaffRole, type StaffRole } from '../../data/permissions';
import olasoLogo from '../../../assets/brand/olaso-wordmark-operational-green-transparent.png';
import lockBackground from '../../../assets/brand/olaso-lock-drink-note.jpg';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  settings: TerminalSettings;
  onUnlock: (session: StaffSession) => Promise<void>;
}

function unlockErrorMessage(caught: unknown) {
  const message = caught instanceof Error ? caught.message : '';
  if (/PIN is incorrect|Wrong PIN/i.test(message)) return 'Wrong PIN. Try again.';
  if (/too many failed PIN attempts/i.test(message)) {
    return 'Too many failed PIN attempts. Try again later.';
  }
  if (/identity is unavailable offline/i.test(message)) return message;
  if (/staff access is unavailable/i.test(message)) return message;
  if (/must sign in online once before offline access/i.test(message)) return message;
  if (/protected offline credentials are unavailable/i.test(message)) return message;
  return 'Unable to unlock. Check the connection and try again.';
}

type CachedStaff = {
  id: string;
  name: string;
  role: StaffRole;
  revision: number;
};

export function LockScreen({ settings, onUnlock }: LockScreenProps) {
  const [now, setNow] = useState(new Date());
  const { available } = useConnectionStatus();
  const online = available === true;
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState<CachedStaff[]>([]);
  const [authoritativeStaff, setAuthoritativeStaff] = useState<CachedStaff[]>();
  const [staffProfileId, setStaffProfileId] = useState('');
  const [pin, setPin] = useState('');
  const signIn = useAction(api.identity.signIn);
  const convex = useConvex();

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    let active = true;
    setAuthoritativeStaff(undefined);
    loadOperationalCache().then((cache) => {
      if (!active) return;
      const activeStaff = cache.staffProfiles.flatMap(({ id, name, role, revision }) =>
        isStaffRole(role) ? [{ id, name, role, revision }] : [],
      );
      setStaff(activeStaff);
      setStaffProfileId(activeStaff[0]?.id ?? '');
      if (online) {
        void convex.query(api.identity.listActiveProfiles, { deviceId: settings.deviceId })
          .then((profiles) => {
            if (!active) return;
            const remoteStaff = profiles.flatMap(({ id, name, role, revision }) =>
              isStaffRole(role) ? [{ id: String(id), name, role, revision: Number(revision) }] : [],
            );
            if (!remoteStaff.length) return;
            setAuthoritativeStaff(remoteStaff);
            setStaff(remoteStaff);
            setStaffProfileId((current) =>
              remoteStaff.some((member) => member.id === current) ? current : remoteStaff[0].id,
            );
          })
          .catch(() => undefined);
      }
    }).catch(() => {
      if (active) setError('Staff access is unavailable. Connect and sync this terminal.');
    });
    return () => { active = false; };
  }, [convex, online, settings.deviceId]);

  async function unlock() {
    if (!staffProfileId || !/^\d{6}$/.test(pin)) {
      setError('Choose a staff member and enter a six-digit PIN.');
      return;
    }
    setUnlocking(true);
    setError('');
    try {
      let unlockedSession: StaffSession | undefined;
      const unlockOffline = async () => {
        const saved = await loadStaffSession(staffProfileId);
        const cached = staff.find((member) => member.id === staffProfileId);
        if (!saved || !cached || saved.staffProfileId !== cached.id
            || saved.name !== cached.name || saved.role !== cached.role) {
          throw new Error('This staff identity is unavailable offline. Connect and sync this terminal.');
        }
        const result = await verifyOfflinePin(staffProfileId, pin);
        if (result.kind === 'locked') {
          throw new Error('Too many failed PIN attempts. Try again later.');
        }
        if (result.kind === 'incorrect') {
          throw new Error(`PIN is incorrect. ${result.attemptsRemaining} attempts remaining.`);
        }
        unlockedSession = saved;
      };
      const networkAvailable = await readSecureSessionNetworkStatus();
      if (!networkAvailable) {
        await unlockOffline();
      } else {
        try {
        const session = await signIn({ staffProfileId: staffProfileId as never, pin, deviceId: settings.deviceId });
        if (session.kind !== 'authenticated') {
          if (session.kind === 'locked') {
            throw new Error('Too many failed PIN attempts. Try again later.');
          }
          throw new Error('Wrong PIN. Try again.');
        }
        const authenticatedProfile = staff.find((member) => member.id === session.staffProfileId);
        if (!authenticatedProfile) throw new Error('Staff access is unavailable. Sign in again.');
        const localProfile = {
          ...authenticatedProfile,
          name: session.name,
          role: session.role,
          identityRevision: 0,
        };
        const archivedProfileIds = authoritativeStaff?.some(
          (member) => member.id === session.staffProfileId,
        )
          ? await reconcileAuthenticatedStaffProfiles(
            authoritativeStaff.map((member) => ({ ...member, identityRevision: 0 })),
            session.staffProfileId,
          )
          : [];
        if (!authoritativeStaff?.some((member) => member.id === session.staffProfileId)) {
          await saveAuthenticatedStaffProfile(localProfile);
        }
        await saveStaffSession(session, pin);
        for (const archivedProfileId of archivedProfileIds) {
          await clearStaffSession(archivedProfileId);
        }
        await clearLegacyStaffSession();
        unlockedSession = session;
        } catch (onlineError) {
          if (!isServiceUnavailable(onlineError)) {
            throw onlineError;
          }
          await unlockOffline();
        }
      }
      if (!unlockedSession) throw new Error('Staff session is unavailable. Sign in again.');
      await onUnlock(unlockedSession);
    } catch (caught) {
      setError(unlockErrorMessage(caught));
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
        <img className={styles.backdrop} src={lockBackground} alt="" aria-hidden="true" />
        <span className={styles.backdropWash} aria-hidden="true" />
        <img
          className={styles.wordmark}
          src={olasoLogo}
          alt="Olaso"
          width={320}
          height={78}
        />
        <span className={styles.accent} />
        <div className={styles.brandMessage}>
          <h1>Every sale.<br />Every gram.</h1>
          <p>Your Olaso terminal is locked and ready for the next shift.</p>
        </div>
        <div className={styles.connection}>
          {online
            ? <WifiHigh size={14} aria-hidden="true" />
            : <WifiSlash size={14} aria-hidden="true" />}
          <span>{available === undefined
            ? 'Checking connection…'
            : online
              ? 'Terminal online'
              : 'Terminal offline · local service ready'}</span>
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
          Choose your profile and enter your six-digit PIN.
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
          <span>STAFF SIGN-IN</span>
          <p>
            Your staff identity is recorded with protected terminal access.
          </p>
        </div>

        <label className={styles.field}>
          <span>Staff member</span>
          <select value={staffProfileId} onChange={(event) => setStaffProfileId(event.target.value)} disabled={unlocking}>
            {staff.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>PIN</span>
          <input value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" type="password" autoComplete="current-password" disabled={unlocking} />
        </label>

        <button
          className={styles.unlock}
          type="button"
          disabled={unlocking}
          onClick={unlock}
        >
          {unlocking ? 'Unlocking…' : 'Unlock POS'}
        </button>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
      </section>
    </main>
  );
}
