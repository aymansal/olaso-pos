import { Bell, FileText, User } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import {
  TopNavigation,
  type NavigationPage,
} from '../TopNavigation/TopNavigation';
import styles from './Header.module.css';
import { useStaffSession } from '../../../../data/sessionContext';
import { hasPermission } from '../../../../data/permissions';
import type { ClockFormat } from '../../../../data/terminalSettings';
import olasoLogo from '../../../../../assets/brand/olaso-wordmark-operational-green-transparent.png';

interface HeaderProps {
  activePage?: NavigationPage;
  clockFormat: ClockFormat;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

export function Header({
  activePage,
  clockFormat,
  onNavigate,
  onOpenSettings,
}: HeaderProps) {
  const [now, setNow] = useState(new Date());
  const staff = useStaffSession();
  const canOpenSettings = hasPermission(staff.role, 'settings');
  const canViewReports = hasPermission(staff.role, 'reports');
  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(clock);
  }, []);
  const date = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: clockFormat === '12-hour',
  }).format(now);
  return (
    <header className={styles.header}>
      <div className={styles.brandSide}>
        <div className={styles.wordmark}>
          <img src={olasoLogo} alt="Olaso" width={96} height={26} />
        </div>
        <time className={styles.date} dateTime={now.toISOString()}>{date} · {time}</time>
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
