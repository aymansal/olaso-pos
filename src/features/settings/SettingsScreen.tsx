import { useState } from 'react';
import { useConnectionStatus } from '../../data/connectionContext';
import { useSettingsData } from '../../data/useSettingsData';
import type { ClockFormat, TerminalPreferences } from '../../data/terminalSettings';
import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { SettingsContentPanel } from './components/SettingsContentPanel/SettingsContentPanel';
import {
  SettingsNavigationPanel,
  type SettingsSection,
} from './components/SettingsNavigationPanel/SettingsNavigationPanel';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  clockFormat: ClockFormat;
  onNavigate: (page: NavigationPage) => void;
  onLock: () => Promise<void>;
  onClockFormatChange: (clockFormat: ClockFormat) => void;
}

export function SettingsScreen({
  clockFormat,
  onNavigate,
  onLock,
  onClockFormatChange,
}: SettingsScreenProps) {
  const data = useSettingsData();
  const { available } = useConnectionStatus();
  const [section, setSection] = useState<SettingsSection>('general');
  const online = available === true;
  const [lockError, setLockError] = useState('');

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

  async function savePreferences(input: TerminalPreferences) {
    await data.save(input);
    onClockFormatChange(input.clockFormat);
  }

  return (
    <main className={styles.screen}>
      <Header
        clockFormat={clockFormat}
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
        isInstallingPrinterLogo={data.isInstallingPrinterLogo}
        online={online}
        message={data.message}
        error={data.error || (section === 'sync' ? data.syncError : '')}
        onSave={savePreferences}
        onSync={data.syncNow}
        onTestPrinter={data.testPrinter}
        onInstallPrinterLogo={data.installPrinterLogo}
      />
    </main>
  );
}
