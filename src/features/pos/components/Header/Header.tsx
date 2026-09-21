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
import type { AppLanguage } from '../../../../lib/locale';
import { useT } from '../../../../lib/locale';
import olasoLogo from '../../../../../assets/brand/olaso-wordmark-operational-green-transparent.png';
import { ProfileControl } from '../ProfileControl/ProfileControl.tsx';

interface HeaderProps {
  activePage?: NavigationPage;
  clockFormat: ClockFormat;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
  onSwitchStaff: () => Promise<boolean>;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => Promise<void>;
  onPrintDailyReport?: () => Promise<void>;
  onSkipToContent?: () => void;
}

export function Header({
  activePage,
  clockFormat,
  onNavigate,
  onOpenSettings,
  onSwitchStaff,
  language,
  onLanguageChange,
  onPrintDailyReport,
  onSkipToContent,
}: HeaderProps) {
  const t = useT();
  const [now, setNow] = useState(new Date());
  const staff = useStaffSession();
  const { foreground } = useConnectionStatus();
  const canOpenSettings = Boolean(onOpenSettings)
    && hasPermission(staff.role, 'settings');
  const [printingReport, setPrintingReport] = useState(false);
  const canPrintDailyReport = staff.role === 'owner' && Boolean(onPrintDailyReport);

  async function printReport() {
    if (!onPrintDailyReport || printingReport) return;
    setPrintingReport(true);
    try { await onPrintDailyReport(); } finally { setPrintingReport(false); }
  }
  useEffect(() => {
    if (!foreground) return;
    setNow(new Date());
    const clock = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(clock);
  }, [foreground]);
  const date = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
  const time = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: clockFormat === '12-hour',
  }).format(now);
  return (
    <header className={styles.header}>
      {onSkipToContent ? <a className={styles.skipLink} href="#olaso-content" onClick={(event) => {
        event.preventDefault();
        onSkipToContent();
      }}>{t('Skip to content')}</a> : null}
      <div className={styles.brandSide}>
        <div className={styles.wordmark}>
          <img src={olasoLogo} alt="Olaso" width={96} height={26} />
        </div>
        <time className={styles.date} dateTime={now.toISOString()}>
          <span className={styles.calendarDate}>{date} ·</span>
          <span className={styles.clock}>{time}</span>
        </time>
      </div>

      <TopNavigation activePage={activePage} onNavigate={onNavigate} role={staff.role} />

      <div className={styles.actions}>
        {canPrintDailyReport ? <button className={styles.report} type="button" onClick={() => void printReport()} disabled={printingReport}>
          <span>{t(printingReport ? 'Printing…' : 'Report')}</span>
          <File width={18} height={18} aria-hidden="true" />
        </button> : null}
        <ProfileControl
          name={staff.name}
          role={staff.role}
          canOpenSettings={canOpenSettings}
          onOpenSettings={onOpenSettings}
          onSwitchStaff={onSwitchStaff}
          language={language}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </header>
  );
}
