import { User } from '@boxicons/react';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { StaffRole } from '../../../../data/permissions.ts';
import type { AppLanguage } from '../../../../lib/locale';
import { useT } from '../../../../lib/locale';
import styles from './ProfileControl.module.css';

const ROLE_LABEL: Record<StaffRole, string> = {
  owner: 'Owner',
  manager: 'Manager',
  cashier: 'Cashier',
};

export function ProfileControl({
  name,
  role,
  canOpenSettings,
  language,
  onLanguageChange,
  onOpenSettings,
  onSwitchStaff,
}: {
  name: string;
  role: StaffRole;
  canOpenSettings: boolean;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => Promise<void>;
  onOpenSettings?: () => void;
  onSwitchStaff: () => Promise<boolean>;
}) {
  const t = useT();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    if (!open || !root.current || !menu.current) return;
    const box = root.current.getBoundingClientRect();
    menu.current.style.top = `${box.bottom + 6}px`;
    menu.current.style.right = `${Math.max(8, window.innerWidth - box.right)}px`;
    menu.current.showPopover();
    return () => { if (menu.current?.matches(':popover-open')) menu.current.hidePopover(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
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
      setError(t('The terminal could not be locked.'));
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className={styles.wrap} ref={root}>
      <button
        ref={trigger}
        className={styles.profile}
        type="button"
        aria-label={`${name}, ${t(ROLE_LABEL[role])}: ${t('Open staff menu')}`}
        aria-expanded={open}
        aria-controls={open ? 'staff-profile-menu' : undefined}
        onClick={() => {
          setError('');
          setOpen((current) => !current);
        }}
      >
        <span className={styles.avatar}><User width={22} height={22} aria-hidden="true" /></span>
        <span className={styles.profileCopy}>
          <strong>{name}</strong>
          <small>{t(ROLE_LABEL[role])}</small>
        </span>
      </button>
      {open ? (
        <div ref={menu} popover="auto" onToggle={(event) => {
          if (event.newState === 'closed') setOpen(false);
        }} className={styles.menu} id="staff-profile-menu">
          <div
            className={styles.language}
            role="group"
            aria-label={t('Application')}
            style={{ '--index': language === 'fr' ? 1 : 0 } as CSSProperties}
          >
            <span className={styles.languageIndicator} aria-hidden="true" />
            {(['en', 'fr'] as const).map((value) => (
              <button
                type="button"
                className={language === value ? styles.languageOn : ''}
                aria-pressed={language === value}
                onClick={() => {
                  setError('');
                  void onLanguageChange(value).catch(() => {
                    setError(t('Language could not be changed. Select EN or FR to try again.'));
                  });
                }}
                key={value}
              >
                {value === 'en' ? 'EN' : 'FR'}
              </button>
            ))}
          </div>
          {canOpenSettings ? (
            <button type="button" onClick={() => {
              setOpen(false);
              onOpenSettings?.();
            }}>
              {t('Settings')}
            </button>
          ) : null}
          <button
            type="button"
            disabled={switching}
            onClick={() => void switchStaff()}
          >
            {switching ? t('Locking…') : t('Lock / switch staff')}
          </button>
          {error ? <p role="alert">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
