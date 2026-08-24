import { User } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import type { StaffRole } from '../../../../data/permissions.ts';
import styles from './ProfileControl.module.css';

export function ProfileControl({
  name,
  role,
  canOpenSettings,
  onOpenSettings,
  onSwitchStaff,
}: {
  name: string;
  role: StaffRole;
  canOpenSettings: boolean;
  onOpenSettings?: () => void;
  onSwitchStaff: () => Promise<boolean>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  async function switchStaff() {
    setSwitching(true);
    setError('');
    try {
      if (await onSwitchStaff()) setOpen(false);
    } catch {
      setError('The terminal could not be locked.');
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className={styles.wrap} ref={root}>
      <button
        className={styles.profile}
        type="button"
        aria-label="Open staff menu"
        aria-expanded={open}
        aria-controls="staff-profile-menu"
        onClick={() => {
          setError('');
          setOpen((current) => !current);
        }}
      >
        <span className={styles.avatar}><User size={22} /></span>
        <span className={styles.profileCopy}>
          <strong>{name}</strong>
          <small>{role}</small>
        </span>
      </button>
      {open ? (
        <div className={styles.menu} id="staff-profile-menu" role="menu">
          {canOpenSettings ? (
            <button type="button" role="menuitem" onClick={() => {
              setOpen(false);
              onOpenSettings?.();
            }}>
              Settings
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={switching}
            onClick={() => void switchStaff()}
          >
            {switching ? 'Locking…' : 'Lock / switch staff'}
          </button>
          {error ? <p role="alert">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
