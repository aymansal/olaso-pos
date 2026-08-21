import { useEffect, useState } from 'react';
import { useSettingsData } from '../../data/useSettingsData';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { SettingsContentPanel } from './components/SettingsContentPanel/SettingsContentPanel';
import {
  SettingsNavigationPanel,
  type SettingsSection,
} from './components/SettingsNavigationPanel/SettingsNavigationPanel';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  onNavigate: (page: NavigationPage) => void;
  onLock: () => Promise<void>;
}

export function SettingsScreen({ onNavigate, onLock }: SettingsScreenProps) {
  const data = useSettingsData();
  const [section, setSection] = useState<SettingsSection>('general');
  const [online, setOnline] = useState(navigator.onLine);
  const [lockError, setLockError] = useState('');

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  async function lock() {
    setLockError('');
    try {
      await onLock();
    } catch (caught) {
      setLockError(
        caught instanceof Error
          ? caught.message
          : 'This terminal could not be locked.',
      );
    }
  }

  return (
    <main className={styles.screen}>
      <Header
        brand="olaso"
        onNavigate={onNavigate}
        onOpenSettings={() => undefined}
      />
      <SettingsNavigationPanel
        activeSection={section}
        lockError={lockError}
        onSectionChange={setSection}
        onLock={lock}
      />
      <SettingsContentPanel
        section={section}
        settings={data.settings}
        isLoading={data.isLoading}
        isSyncing={data.isSyncing}
        isTestingPrinter={data.isTestingPrinter}
        online={online}
        message={data.message}
        error={data.error || (section === 'sync' ? data.syncError : '')}
        onSave={data.save}
        onSync={data.syncNow}
        onTestPrinter={data.testPrinter}
      />
    </main>
  );
}
