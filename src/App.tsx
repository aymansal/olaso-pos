import { Activity, lazy, startTransition, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  loadTerminalSettings,
  setTerminalLocked,
  type TerminalPreferences,
  type TerminalSettings,
} from './data/terminalSettings';
import { PosScreen } from './features/pos/PosScreen';
import { Header } from './features/pos/components/Header/Header';
import type { NavigationPage } from './features/pos/components/TopNavigation/TopNavigation';
import appStyles from './App.module.css';
import {
  createInitialPosSession,
  hasUnfinishedCart,
} from './features/pos/posSession';
import { LockScreen } from './features/settings/LockScreen';
import { StaffSessionProvider } from './data/sessionContext';
import { ReconnectProvider } from './data/reconnectContext';
import type { StaffSession } from './data/identitySession';
import { hasPermission, type Permission } from './data/permissions';
import olasoLogo from '../assets/brand/olaso-wordmark-operational-green-transparent.png';
import { StartupDots } from './components/StartupDots/StartupDots';
import startupStyles from './data/AppDataProvider.module.css';

const loadDashboard = () => import('./features/dashboard/DashboardScreen');
const loadOrders = () => import('./features/orders/OrdersScreen');
const loadProducts = () => import('./features/products/ProductsScreen');
const loadReports = () => import('./features/reports/ReportsScreen');
const loadSettings = () => import('./features/settings/SettingsScreen');
const loadStock = () => import('./features/stock/StockScreen');

const DashboardScreen = lazy(() =>
  loadDashboard().then((module) => ({ default: module.DashboardScreen })),
);
const OrdersScreen = lazy(() =>
  loadOrders().then((module) => ({ default: module.OrdersScreen })),
);
const ProductsScreen = lazy(() =>
  loadProducts().then((module) => ({ default: module.ProductsScreen })),
);
const ReportsScreen = lazy(() =>
  loadReports().then((module) => ({ default: module.ReportsScreen })),
);
const SettingsScreen = lazy(() =>
  loadSettings().then((module) => ({ default: module.SettingsScreen })),
);
const StockScreen = lazy(() =>
  loadStock().then((module) => ({ default: module.StockScreen })),
);

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

const screenLoaders: Record<Exclude<AppScreen, 'POS'>, () => Promise<unknown>> = {
  Dashboard: loadDashboard,
  Orders: loadOrders,
  Products: loadProducts,
  Stock: loadStock,
  Reports: loadReports,
  Settings: loadSettings,
};

const SCREEN_FADE_MS = 420;

export function App() {
  const [screen, setScreen] = useState<AppScreen>('POS');
  const [contentScreen, setContentScreen] = useState<AppScreen>('POS');
  const [leavingScreen, setLeavingScreen] = useState<AppScreen>();
  const [fade, setFade] = useState<'idle' | 'prepare' | 'run'>('idle');
  const [visitedScreens, setVisitedScreens] = useState<AppScreen[]>(['POS']);
  const [posSession, setPosSession] = useState(createInitialPosSession);
  const [terminal, setTerminal] = useState<TerminalSettings>();
  const [sessionReady, setSessionReady] = useState(false);
  const [startupError, setStartupError] = useState<string>();
  const [staffSession, setStaffSession] = useState<StaffSession>();
  const contentScreenRef = useRef<AppScreen>('POS');

  function resetScreens() {
    setVisitedScreens(['POS']);
    setScreen('POS');
    setContentScreen('POS');
    contentScreenRef.current = 'POS';
    setLeavingScreen(undefined);
    setFade('idle');
  }

  function openScreen(page: AppScreen) {
    if (!staffSession || !hasPermission(staffSession.role, screenPermission[page])) {
      return;
    }
    if (page === contentScreenRef.current && fade === 'idle') return;
    setScreen(page);
    startTransition(() => {
      setVisitedScreens((visited) =>
        visited.includes(page) ? visited : [...visited, page],
      );
      if (contentScreenRef.current !== page) {
        setLeavingScreen(contentScreenRef.current);
        setFade('prepare');
      }
      contentScreenRef.current = page;
      setContentScreen(page);
    });
  }

  function navigate(page: NavigationPage) {
    openScreen(page);
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

  useLayoutEffect(() => {
    if (fade !== 'prepare') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLeavingScreen(undefined);
      setFade('idle');
      return;
    }
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setFade('run'));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [fade]);

  useEffect(() => {
    if (fade !== 'run') return;
    const timeout = window.setTimeout(() => {
      setLeavingScreen(undefined);
      setFade('idle');
    }, SCREEN_FADE_MS);
    return () => window.clearTimeout(timeout);
  }, [fade]);

  useEffect(() => {
    if (!staffSession || terminal?.isLocked) return;
    const timeout = window.setTimeout(() => {
      for (const [page, load] of Object.entries(screenLoaders)) {
        if (hasPermission(staffSession.role, screenPermission[page as AppScreen])) {
          void load();
        }
      }
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [staffSession, terminal?.isLocked]);

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
    resetScreens();
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
    resetScreens();
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
    openScreen('Settings');
  }

  if (terminal.isLocked) {
    return <LockScreen settings={terminal} onUnlock={unlock} />;
  }

  if (!staffSession) {
    return (
      <main className={startupStyles.startup} aria-label="Terminal locked" role="alert">
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <strong>Terminal locked</strong>
        <span>Staff session is unavailable. Lock and sign in again.</span>
        <button type="button" onClick={() => void lock()}>Lock terminal</button>
      </main>
    );
  }

  const activeScreen = hasPermission(staffSession.role, screenPermission[screen])
    ? screen
    : 'POS';
  const visibleContent = hasPermission(staffSession.role, screenPermission[contentScreen])
    ? contentScreen
    : 'POS';
  const visibleLeaving =
    leavingScreen && hasPermission(staffSession.role, screenPermission[leavingScreen])
      ? leavingScreen
      : undefined;

  return (
    <StaffSessionProvider session={{ ...staffSession, deviceId: terminal.deviceId }}>
      <ReconnectProvider onSessionUnavailable={lock}>
        <div className={appStyles.shell}>
          <Header
            activePage={activeScreen === 'Settings' ? undefined : activeScreen}
            clockFormat={terminal.clockFormat}
            onNavigate={navigate}
            onOpenSettings={activeScreen === 'Settings' ? undefined : openSettings}
            onSwitchStaff={requestStaffSwitch}
          />
          {visitedScreens.map((visited) => {
            if (!hasPermission(staffSession.role, screenPermission[visited])) return null;
            const live = visited === visibleContent;
            const leaving = visited === visibleLeaving;
            return (
              <div
                className={appStyles.slot}
                data-live={live ? 'true' : undefined}
                data-leave={leaving ? 'true' : undefined}
                data-fade={fade !== 'idle' && (live || leaving) ? fade : undefined}
                key={visited}
              >
                <Activity mode={live || leaving ? 'visible' : 'hidden'}>
                  <Suspense fallback={null}>
                  {visited === 'Settings' ? (
                    <SettingsScreen
                      hasUnfinishedCart={hasUnfinishedCart(posSession)}
                      onLock={requestStaffSwitch}
                      onPreferencesChange={updatePreferences}
                    />
                  ) : visited === 'Dashboard' ? (
                    <DashboardScreen onNavigate={navigate} />
                  ) : visited === 'Orders' ? (
                    <OrdersScreen />
                  ) : visited === 'Products' ? (
                    <ProductsScreen />
                  ) : visited === 'Stock' ? (
                    <StockScreen />
                  ) : visited === 'Reports' ? (
                    <ReportsScreen />
                  ) : (
                    <PosScreen
                      session={posSession}
                      onSessionChange={setPosSession}
                      receiptLanguage={terminal.receiptLanguage}
                    />
                  )}
                  </Suspense>
                </Activity>
              </div>
            );
          })}
        </div>
      </ReconnectProvider>
    </StaffSessionProvider>
  );
}
