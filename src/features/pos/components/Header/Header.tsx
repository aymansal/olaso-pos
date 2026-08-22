import { Bell, FileText, User } from '@phosphor-icons/react';
import { IconButton } from '../IconButton/IconButton';
import {
  TopNavigation,
  type NavigationPage,
} from '../TopNavigation/TopNavigation';
import styles from './Header.module.css';
import { useStaffSession } from '../../../../data/sessionContext';
import { hasPermission } from '../../../../data/permissions';

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
  const staff = useStaffSession();
  const canOpenSettings = hasPermission(staff.role, 'settings');
  const canViewReports = hasPermission(staff.role, 'reports');
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

      <TopNavigation activePage={activePage} onNavigate={onNavigate} role={staff.role} />

      <div className={styles.actions}>
        {canViewReports ? <button className={styles.report} type="button" onClick={() => onNavigate?.('Reports')}>
          <span>Report</span>
          <FileText size={18} weight="regular" />
        </button> : null}
        <div className={styles.notificationWrap}>
          <IconButton label="Notifications" icon={<Bell size={18} />} />
          <span className={styles.badge}>1</span>
        </div>
        {canOpenSettings ? <button
          className={styles.profile}
          type="button"
          aria-label="Open settings"
          onClick={onOpenSettings}
        >
          <span className={styles.avatar}><User size={22} /></span>
          <span className={styles.profileCopy}>
            <strong>{staff.name}</strong>
            <small>{staff.role}</small>
          </span>
        </button> : <div className={styles.profile}>
          <span className={styles.avatar}><User size={22} /></span>
          <span className={styles.profileCopy}>
            <strong>{staff.name}</strong>
            <small>{staff.role}</small>
          </span>
        </div>}
      </div>
    </header>
  );
}
