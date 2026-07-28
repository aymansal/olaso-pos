import {
  Database,
  Gear,
  Info,
  LockKey,
  Printer,
  Receipt,
  Stack,
  UsersThree,
} from '@phosphor-icons/react';
import styles from './SettingsNavigationPanel.module.css';

export type SettingsSection = 'general' | 'sync' | 'about';

const items: ReadonlyArray<{
  id?: SettingsSection;
  label: string;
  icon: typeof Gear;
  unavailable?: string;
}> = [
  { id: 'general', label: 'General', icon: Gear },
  {
    label: 'Staff & access',
    icon: UsersThree,
    unavailable: 'Pending owner role and login decisions',
  },
  {
    label: 'Printer & hardware',
    icon: Printer,
    unavailable: 'Printer integration is outside this beta',
  },
  {
    label: 'Orders & receipts',
    icon: Receipt,
    unavailable: 'Pending owner receipt and correction policies',
  },
  {
    label: 'Stock rules',
    icon: Stack,
    unavailable: 'Pending owner stock-blocking policy',
  },
  { id: 'sync', label: 'Data & sync', icon: Database },
  { id: 'about', label: 'About', icon: Info },
];

interface SettingsNavigationPanelProps {
  activeSection: SettingsSection;
  lockError: string;
  onSectionChange: (section: SettingsSection) => void;
  onLock: () => Promise<void>;
}

export function SettingsNavigationPanel({
  activeSection,
  lockError,
  onSectionChange,
  onLock,
}: SettingsNavigationPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Settings sections">
      <div className={styles.heading}>
        <h1>Settings</h1>
        <p>Terminal and operational preferences</p>
      </div>

      <nav className={styles.sections}>
        {items.map(({ id, label, icon: Icon, unavailable }) => {
          const active = id === activeSection;
          return (
            <button
              className={`${styles.section} ${active ? styles.active : ''}`}
              type="button"
              disabled={Boolean(unavailable)}
              title={unavailable}
              aria-current={active ? 'page' : undefined}
              onClick={() => id && onSectionChange(id)}
              key={label}
            >
              <span className={styles.icon}>
                <Icon size={16} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.lockWrap}>
        <button className={styles.lock} type="button" onClick={onLock}>
          <LockKey size={16} aria-hidden="true" />
          <span>Lock application</span>
        </button>
        {lockError ? <p role="alert">{lockError}</p> : null}
      </div>
    </aside>
  );
}
