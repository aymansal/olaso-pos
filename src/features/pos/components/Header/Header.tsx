import { Bell, FileText, User } from '@phosphor-icons/react';
import { IconButton } from '../IconButton/IconButton';
import {
  TopNavigation,
  type NavigationPage,
} from '../TopNavigation/TopNavigation';
import styles from './Header.module.css';

interface HeaderProps {
  activePage?: NavigationPage;
  brand?: 'reference' | 'olaso';
  dateLabel?: string;
  dateTime?: string;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

export function Header({
  activePage,
  brand = 'reference',
  dateLabel = 'Thursday, 23 June',
  dateTime = '2026-06-23',
  onNavigate,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brandSide}>
        <div
          className={`${styles.wordmark} ${brand === 'olaso' ? styles.olasoWordmark : ''}`}
          aria-label={brand === 'olaso' ? 'Olaso' : 'Green Grounds Coffee'}
        >
          <span className={styles.brandDot} />
          {brand === 'olaso'
            ? <span>OLASO</span>
            : <span>GREEN<br />GROUNDS<br />COFFEE</span>}
        </div>
        <time className={styles.date} dateTime={dateTime}>{dateLabel}</time>
      </div>

      <TopNavigation activePage={activePage} onNavigate={onNavigate} />

      <div className={styles.actions}>
        <button className={styles.report} type="button">
          <span>Report</span>
          <FileText size={18} weight="regular" />
        </button>
        <div className={styles.notificationWrap}>
          <IconButton label="Notifications" icon={<Bell size={18} />} />
          <span className={styles.badge}>1</span>
        </div>
        <button
          className={styles.profile}
          type="button"
          aria-label="Open settings"
          onClick={onOpenSettings}
        >
          <span className={styles.avatar}><User size={22} /></span>
          <span className={styles.profileCopy}>
            <strong>Samantha W</strong>
            <small>Cashier</small>
          </span>
        </button>
      </div>
    </header>
  );
}
