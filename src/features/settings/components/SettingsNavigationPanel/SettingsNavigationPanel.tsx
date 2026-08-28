import { Database, Cog, InfoCircle, Lock, Printer, Receipt, Layers, Group } from '@boxicons/react';
import styles from './SettingsNavigationPanel.module.css';

export type SettingsSection = 'general' | 'staff' | 'printer' | 'sync' | 'about';

const items: ReadonlyArray<{
  id?: SettingsSection;
  label: string;
  icon: typeof Cog;
  unavailable?: string;
}> = [
  { id: 'general', label: 'General', icon: Cog },
  { id: 'staff', label: 'Staff & access', icon: Group },
  { id: 'printer', label: 'Printer & hardware', icon: Printer },
  {
    label: 'Orders & receipts',
    icon: Receipt,
    unavailable: 'Pending owner receipt and correction policies',
  },
  {
    label: 'Stock rules',
    icon: Layers,
    unavailable: 'Pending owner stock-blocking policy',
  },
  { id: 'sync', label: 'Data & sync', icon: Database },
  { id: 'about', label: 'About', icon: InfoCircle },
];

interface SettingsNavigationPanelProps {
  activeSection: SettingsSection;
  lockError: string;
  onSectionChange: (section: SettingsSection) => void;
  onLock: () => Promise<boolean>;
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
                <Icon width={16} height={16} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.lockWrap}>
        <button className={styles.lock} type="button" onClick={() => void onLock()}>
          <Lock width={16} height={16} aria-hidden="true" />
          <span>Lock application</span>
        </button>
        {lockError ? <p role="alert">{lockError}</p> : null}
      </div>
    </aside>
  );
}
