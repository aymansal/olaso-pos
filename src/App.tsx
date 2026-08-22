import { useEffect, useState } from 'react';
import {
  loadTerminalSettings,
  setTerminalLocked,
  type TerminalSettings,
} from './data/terminalSettings';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { PosScreen } from './features/pos/PosScreen';
import type { NavigationPage } from './features/pos/components/TopNavigation/TopNavigation';
import { createInitialPosSession } from './features/pos/posSession';
import { ProductsScreen } from './features/products/ProductsScreen';
import { ReportsScreen } from './features/reports/ReportsScreen';
import { LockScreen } from './features/settings/LockScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { StockScreen } from './features/stock/StockScreen';
import { StaffSessionProvider } from './data/sessionContext';
import type { StaffSession } from './data/identitySession';

type AppScreen = NavigationPage | 'Settings';

export function App() {
  const [screen, setScreen] = useState<AppScreen>('POS');
  const [posSession, setPosSession] = useState(createInitialPosSession);
  const [terminal, setTerminal] = useState<TerminalSettings>();
  const [sessionReady, setSessionReady] = useState(false);
  const [startupError, setStartupError] = useState<string>();
  const [staffSession, setStaffSession] = useState<StaffSession>();

  function navigate(page: NavigationPage) {
    setScreen(page);
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
    setScreen('POS');
  }

  if (!sessionReady) return <main aria-label="Loading Olaso" aria-busy="true" />;

  if (startupError || !terminal) {
    return (
      <main aria-label="Terminal recovery" role="alert">
        <h1>Terminal locked</h1>
        <p>{startupError ?? 'Terminal settings are unavailable. POS remains locked.'}</p>
        <button type="button" onClick={() => void restoreTerminal()}>Retry terminal check</button>
      </main>
    );
  }

  if (terminal.isLocked) {
    return <LockScreen settings={terminal} onUnlock={unlock} />;
  }

  if (!staffSession) {
    return <main aria-label="Terminal locked" role="alert">Staff session is unavailable. Lock and sign in again.</main>;
  }

  return (
    <StaffSessionProvider session={{ ...staffSession, deviceId: terminal.deviceId }}>
      {screen === 'Settings' ? (
      <SettingsScreen
        onNavigate={navigate}
        onLock={lock}
      />
      ) : screen === 'Dashboard' ? (
      <DashboardScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
      ) : screen === 'Orders' ? (
      <OrdersScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
      ) : screen === 'Products' ? (
      <ProductsScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
      ) : screen === 'Stock' ? (
      <StockScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
      ) : screen === 'Reports' ? (
      <ReportsScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
      ) : (
      <PosScreen
      session={posSession}
      onSessionChange={setPosSession}
      onNavigate={navigate}
      onOpenSettings={() => setScreen('Settings')}
      />
      )}
    </StaffSessionProvider>
  );
}
