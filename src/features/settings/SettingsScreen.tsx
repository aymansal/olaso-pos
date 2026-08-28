import { useState } from 'react';
import { useConnectionStatus } from '../../data/connectionContext';
import { useSettingsData } from '../../data/useSettingsData';
import { useStaffManagement } from '../../data/useStaffManagement';
import type { TerminalPreferences } from '../../data/terminalSettings';
import { SettingsContentPanel } from './components/SettingsContentPanel/SettingsContentPanel';
import { StaffAccessPanel } from './components/StaffAccessPanel/StaffAccessPanel';
import {
  SettingsNavigationPanel,
  type SettingsSection,
} from './components/SettingsNavigationPanel/SettingsNavigationPanel';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  hasUnfinishedCart: boolean;
  onLock: () => Promise<boolean>;
  onPreferencesChange: (preferences: TerminalPreferences) => void;
}

export function SettingsScreen({
  hasUnfinishedCart,
  onLock,
  onPreferencesChange,
}: SettingsScreenProps) {
  const data = useSettingsData({
    hasUnfinishedCart,
  });
  const staff = useStaffManagement();
  const { available } = useConnectionStatus();
  const [section, setSection] = useState<SettingsSection>('general');
  const online = available === true;
  const [lockError, setLockError] = useState('');

  async function lock() {
    setLockError('');
    try {
      return await onLock();
    } catch (caught) {
      setLockError(
        caught instanceof Error
          ? caught.message
          : 'This terminal could not be locked.',
      );
      return false;
    }
  }

  async function savePreferences(input: TerminalPreferences) {
    await data.save(input);
    onPreferencesChange(input);
  }

  return (
    <main className={styles.screen}>
      <SettingsNavigationPanel
        activeSection={section}
        lockError={lockError}
        onSectionChange={setSection}
        onLock={lock}
      />
      {section === 'staff' ? <StaffAccessPanel management={staff} /> : <SettingsContentPanel
        section={section}
        settings={data.settings}
        isLoading={data.isLoading}
        isSyncing={data.isSyncing}
        isTestingPrinter={data.isTestingPrinter}
        isInstallingPrinterLogo={data.isInstallingPrinterLogo}
        isCheckingUpdate={data.isCheckingUpdate}
        isInstallingUpdate={data.isInstallingUpdate}
        installedApp={data.installedApp}
        updateChannelConfigured={data.updateChannelConfigured}
        pendingUpdateVersion={data.pendingManifest?.versionName ?? null}
        hasUnfinishedCart={hasUnfinishedCart}
        online={online}
        message={data.message}
        error={data.error || (section === 'sync' ? data.syncError : '')}
        onSave={savePreferences}
        onSync={data.syncNow}
        onTestPrinter={data.testPrinter}
        onInstallPrinterLogo={data.installPrinterLogo}
        onCheckUpdate={data.checkUpdate}
        onInstallUpdate={data.installUpdate}
        onDismissUpdate={data.dismissUpdate}
      />}
    </main>
  );
}
