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

type AppScreen = NavigationPage | 'Settings';

export function App() {
  const [screen, setScreen] = useState<AppScreen>('POS');
  const [posSession, setPosSession] = useState(createInitialPosSession);
  const [terminal, setTerminal] = useState<TerminalSettings>();
  const [sessionReady, setSessionReady] = useState(false);

  function navigate(page: NavigationPage) {
    setScreen(page);
  }

  useEffect(() => {
    loadTerminalSettings()
      .then(setTerminal)
      .catch(() => undefined)
      .finally(() => setSessionReady(true));
  }, []);

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
    loadTerminalSettings().then(setTerminal).catch(() => undefined);
  }

  async function unlock() {
    await setTerminalLocked(false);
    setTerminal((current) =>
      current ? { ...current, isLocked: false } : current,
    );
    setScreen('POS');
  }

  if (!sessionReady) return <main aria-label="Loading Olaso" aria-busy="true" />;

  if (terminal?.isLocked) {
    return <LockScreen settings={terminal} onUnlock={unlock} />;
  }

  if (screen === 'Settings') {
    return (
      <SettingsScreen
        onNavigate={navigate}
        onLock={lock}
      />
    );
  }

  if (screen === 'Dashboard') {
    return (
      <DashboardScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
    );
  }

  if (screen === 'Orders') {
    return (
      <OrdersScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
    );
  }

  if (screen === 'Products') {
    return (
      <ProductsScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
    );
  }

  if (screen === 'Stock') {
    return (
      <StockScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
    );
  }

  if (screen === 'Reports') {
    return (
      <ReportsScreen
        onNavigate={navigate}
        onOpenSettings={() => setScreen('Settings')}
      />
    );
  }

  return (
    <PosScreen
      session={posSession}
      onSessionChange={setPosSession}
      onNavigate={navigate}
      onOpenSettings={() => setScreen('Settings')}
    />
  );
}
