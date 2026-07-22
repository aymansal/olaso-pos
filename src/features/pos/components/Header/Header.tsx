import { Bell, FileText, User } from '@phosphor-icons/react';
import { IconButton } from '../IconButton/IconButton';
import { TopNavigation } from '../TopNavigation/TopNavigation';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brandSide}>
        <div className={styles.wordmark} aria-label="Green Grounds Coffee">
          <span className={styles.brandDot} />
          <span>GREEN<br />GROUNDS<br />COFFEE</span>
        </div>
        <time className={styles.date} dateTime="2026-06-23">Thursday, 23 June</time>
      </div>

      <TopNavigation />

      <div className={styles.actions}>
        <button className={styles.report} type="button">
          <span>Report</span>
          <FileText size={18} weight="regular" />
        </button>
        <div className={styles.notificationWrap}>
          <IconButton label="Notifications" icon={<Bell size={18} />} />
          <span className={styles.badge}>1</span>
        </div>
        <div className={styles.profile}>
          <span className={styles.avatar}><User size={22} /></span>
          <span className={styles.profileCopy}>
            <strong>Samantha W</strong>
            <small>Cashier</small>
          </span>
        </div>
      </div>
    </header>
  );
}
