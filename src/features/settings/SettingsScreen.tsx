import { useConnectionStatus } from '../../data/connectionContext';
import { useSettingsData } from '../../data/useSettingsData';
import { useStaffManagement } from '../../data/useStaffManagement';
import type { TerminalPreferences } from '../../data/terminalSettings';
import { SettingsContentPanel } from './components/SettingsContentPanel/SettingsContentPanel';
import { StaffAccessPanel } from './components/StaffAccessPanel/StaffAccessPanel';
import styles from './SettingsScreen.module.css';

interface SettingsScreenProps {
  hasUnfinishedCart: boolean;
  onPreferencesChange: (preferences: TerminalPreferences) => void;
  onLanguageChange: (language: TerminalPreferences['applicationLanguage']) => Promise<void>;
}

export function SettingsScreen({
  hasUnfinishedCart,
  onPreferencesChange,
  onLanguageChange,
}: SettingsScreenProps) {
  const data = useSettingsData({
    hasUnfinishedCart,
  });
  const staff = useStaffManagement();
  const { available } = useConnectionStatus();
  const online = available === true;

  async function savePreferences(input: TerminalPreferences) {
    await data.save(input);
    onPreferencesChange(input);
  }

  return (
    <main className={styles.screen}>
      <SettingsContentPanel
        settings={data.settings}
        isLoading={data.isLoading}
        isSyncing={data.isSyncing}
        isTestingPrinter={data.isTestingPrinter}
        isCheckingUpdate={data.isCheckingUpdate}
        isInstallingUpdate={data.isInstallingUpdate}
        installedApp={data.installedApp}
        updateChannelConfigured={data.updateChannelConfigured}
        pendingUpdateVersion={data.pendingManifest?.versionName ?? null}
        hasUnfinishedCart={hasUnfinishedCart}
        online={online}
        message={data.message}
        error={
          data.error
          || ((data.settings?.pendingSyncCount ?? 0) > 0 ? data.syncError : '')
        }
        onSave={savePreferences}
        onLanguageChange={onLanguageChange}
        onSync={data.syncNow}
        onTestPrinter={data.testPrinter}
        onCheckUpdate={data.checkUpdate}
        onInstallUpdate={data.installUpdate}
        onDismissUpdate={data.dismissUpdate}
      />
      <StaffAccessPanel management={staff} />
    </main>
  );
}
