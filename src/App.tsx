import { Activity, useEffect, useState } from 'react';
import {
  loadTerminalSettings,
  setTerminalLocked,
  type TerminalPreferences,
  type TerminalSettings,
} from './data/terminalSettings';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { PosScreen } from './features/pos/PosScreen';
import type { NavigationPage } from './features/pos/components/TopNavigation/TopNavigation';
import {
  createInitialPosSession,
  hasUnfinishedCart,
} from './features/pos/posSession';
import { ProductsScreen } from './features/products/ProductsScreen';
import { ReportsScreen } from './features/reports/ReportsScreen';
import { LockScreen } from './features/settings/LockScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { StockScreen } from './features/stock/StockScreen';
import { StaffSessionProvider } from './data/sessionContext';
import { ReconnectProvider } from './data/reconnectContext';
import type { StaffSession } from './data/identitySession';
import { hasPermission, type Permission } from './data/permissions';
import olasoLogo from '../assets/brand/olaso-wordmark-operational-green-transparent.png';
import { StartupDots } from './components/StartupDots/StartupDots';
import startupStyles from './data/AppDataProvider.module.css';

type AppScreen = NavigationPage | 'Settings';

const screenPermission: Record<AppScreen, Permission> = {
  POS: 'pos',
  Orders: 'orders',
  Dashboard: 'dashboard',
  Products: 'products',
  Stock: 'stock',
  Reports: 'reports',
  Settings: 'settings',
};

export function App() {
  const [screen, setScreen] = useState<AppScreen>('POS');
  const [visitedScreens, setVisitedScreens] = useState<AppScreen[]>(['POS']);
  const [posSession, setPosSession] = useState(createInitialPosSession);
  const [terminal, setTerminal] = useState<TerminalSettings>();
  const [sessionReady, setSessionReady] = useState(false);
  const [startupError, setStartupError] = useState<string>();
  const [staffSession, setStaffSession] = useState<StaffSession>();

  function navigate(page: NavigationPage) {
    if (staffSession && hasPermission(staffSession.role, screenPermission[page])) {
      setVisitedScreens((visited) =>
        visited.includes(page) ? visited : [...visited, page],
      );
      setScreen(page);
    }
  }

  async function restoreTerminal() {
    setSessionReady(false);
    setStartupError(undefined);
    setTerminal(undefined);
    try {
      const restored = await loadTerminalSettings();
      await setTerminalLocked(true);
      setTerminal({ ...restored, isLocked: true });
    } catch {
      setStartupError('Terminal settings could not be verified. POS remains locked. Retry or restore this terminal before serving orders.');
    } finally {
      setSessionReady(true);
    }
  }

  useEffect(() => { void restoreTerminal(); }, []);

  useEffect(() => {
    if (!terminal || terminal.isLocked) return;
    let timeout = window.setTimeout(lock, 5 * 60_000);
    const reset = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(lock, 5 * 60_000);
    };
    window.addEventListener('pointerdown', reset, { passive: true });
    window.addEventListener('keydown', reset);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [terminal?.isLocked]);

  async function lock() {
    await setTerminalLocked(true);
    setVisitedScreens(['POS']);
    setTerminal((current) =>
      current ? { ...current, isLocked: true } : current,
    );
    setStaffSession(undefined);
    loadTerminalSettings().then(setTerminal).catch(() => undefined);
  }

  async function unlock(session: StaffSession) {
    await setTerminalLocked(false);
    setStaffSession(session);
    setTerminal((current) =>
      current ? { ...current, isLocked: false } : current,
    );
    setVisitedScreens(['POS']);
    setScreen('POS');
  }

  function updatePreferences(preferences: TerminalPreferences) {
    setTerminal((current) => current ? { ...current, ...preferences } : current);
  }

  if (!sessionReady) {
    return (
      <main
        className={startupStyles.startup}
        data-olaso-startup="access"
        aria-label="Loading Olaso"
        aria-busy="true"
        role="status"
      >
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <StartupDots />
      </main>
    );
  }

  async function requestStaffSwitch() {
    if (hasUnfinishedCart(posSession) && !window.confirm(
      'Switch staff? The current order will stay for the next staff member.',
    )) return false;
    await lock();
    return true;
  }

  if (startupError || !terminal) {
    return (
      <main className={startupStyles.startup} aria-label="Terminal recovery" role="alert">
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <strong>Terminal locked</strong>
        <span>{startupError ?? 'Terminal settings are unavailable. POS remains locked.'}</span>
        <button type="button" onClick={() => void restoreTerminal()}>Retry terminal check</button>
      </main>
    );
  }

  function openSettings() {
    if (staffSession && hasPermission(staffSession.role, 'settings')) {
      setVisitedScreens((visited) =>
        visited.includes('Settings') ? visited : [...visited, 'Settings'],
      );
      setScreen('Settings');
    }
  }

  if (terminal.isLocked) {
    return <LockScreen settings={terminal} onUnlock={unlock} />;
  }

  if (!staffSession) {
    return <main aria-label="Terminal locked" role="alert">Staff session is unavailable. Lock and sign in again.</main>;
  }

  const activeScreen = hasPermission(staffSession.role, screenPermission[screen])
    ? screen
    : 'POS';

  return (
    <StaffSessionProvider session={{ ...staffSession, deviceId: terminal.deviceId }}>
      <ReconnectProvider onSessionUnavailable={lock}>
        {visitedScreens.map((visited) =>
          !hasPermission(staffSession.role, screenPermission[visited]) ? null : (
            <Activity
              key={visited}
              mode={visited === activeScreen ? 'visible' : 'hidden'}
            >
              {visited === 'Settings' ? (
                <SettingsScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onLock={requestStaffSwitch}
                  onPreferencesChange={updatePreferences}
                />
              ) : visited === 'Dashboard' ? (
                <DashboardScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              ) : visited === 'Orders' ? (
                <OrdersScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              ) : visited === 'Products' ? (
                <ProductsScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              ) : visited === 'Stock' ? (
                <StockScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              ) : visited === 'Reports' ? (
                <ReportsScreen
                  clockFormat={terminal.clockFormat}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              ) : (
                <PosScreen
                  session={posSession}
                  onSessionChange={setPosSession}
                  clockFormat={terminal.clockFormat}
                  receiptLanguage={terminal.receiptLanguage}
                  onNavigate={navigate}
                  onOpenSettings={openSettings}
                  onSwitchStaff={requestStaffSwitch}
                />
              )}
            </Activity>
          ),
        )}
      </ReconnectProvider>
    </StaffSessionProvider>
  );
}
