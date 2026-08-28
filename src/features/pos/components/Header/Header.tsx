import { File } from '@boxicons/react';
import { useEffect, useState } from 'react';
import {
  TopNavigation,
  type NavigationPage,
} from '../TopNavigation/TopNavigation';
import styles from './Header.module.css';
import { useStaffSession } from '../../../../data/sessionContext';
import { useConnectionStatus } from '../../../../data/connectionContext';
import { hasPermission } from '../../../../data/permissions';
import type { ClockFormat } from '../../../../data/terminalSettings';
import olasoLogo from '../../../../../assets/brand/olaso-wordmark-operational-green-transparent.png';
import { ProfileControl } from '../ProfileControl/ProfileControl.tsx';

interface HeaderProps {
  activePage?: NavigationPage;
  clockFormat: ClockFormat;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
  onSwitchStaff: () => Promise<boolean>;
}

export function Header({
  activePage,
  clockFormat,
  onNavigate,
  onOpenSettings,
  onSwitchStaff,
}: HeaderProps) {
  const [now, setNow] = useState(new Date());
  const staff = useStaffSession();
  const { foreground } = useConnectionStatus();
  const canOpenSettings = Boolean(onOpenSettings)
    && hasPermission(staff.role, 'settings');
  const canViewReports = hasPermission(staff.role, 'reports');
  useEffect(() => {
    if (!foreground) return;
    setNow(new Date());
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(clock);
  }, [foreground]);
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
          <File width={18} height={18} />
        </button> : null}
        <ProfileControl
          name={staff.name}
          role={staff.role}
          canOpenSettings={canOpenSettings}
          onOpenSettings={onOpenSettings}
          onSwitchStaff={onSwitchStaff}
        />
      </div>
    </header>
  );
}
