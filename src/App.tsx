import { Activity, lazy, startTransition, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  loadTerminalSettings,
  saveTerminalPreferences,
  setTerminalLocked,
  type TerminalPreferences,
  type TerminalSettings,
} from './data/terminalSettings';
import { loadStaffPreferredLanguage, saveStaffPreferredLanguage } from './data/localStaff';
import { LocaleProvider, translate, type AppLanguage } from './lib/locale';
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
import { printDailyOwnerReport } from './data/dailyOwnerReport.ts';

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

type StockLevelFilter = 'all' | 'low' | 'healthy';

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
  const [stockLevelFilter, setStockLevelFilter] = useState<StockLevelFilter>('all');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const contentScreenRef = useRef<AppScreen>('POS');

  function resetScreens() {
    setVisitedScreens(['POS']);
    setScreen('POS');
    setContentScreen('POS');
    contentScreenRef.current = 'POS';
    setLeavingScreen(undefined);
    setFade('idle');
    setStockLevelFilter('all');
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

  function navigate(
    page: NavigationPage,
    options?: { stockLevel?: StockLevelFilter },
  ) {
    setStockLevelFilter(page === 'Stock' ? options?.stockLevel ?? 'all' : 'all');
    openScreen(page);
  }

  async function restoreTerminal() {
    setSessionReady(false);
    setStartupError(undefined);
    setTerminal(undefined);
    try {
      const restored = await loadTerminalSettings();
      await setTerminalLocked(true);
      setLanguage(restored.applicationLanguage);
      setTerminal({ ...restored, isLocked: true });
    } catch {
      setStartupError(translate(
        language,
        'Terminal settings could not be verified. POS remains locked. Retry or restore this terminal before serving orders.',
      ));
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

  async function applyLanguage(next: AppLanguage) {
    const current = terminal;
    if (staffSession) {
      await saveStaffPreferredLanguage(staffSession.staffProfileId, next);
    }
    if (current) {
      await saveTerminalPreferences({
        terminalName: current.terminalName,
        clockFormat: current.clockFormat,
        receiptLanguage: current.receiptLanguage,
        applicationLanguage: next,
      });
    }
    setLanguage(next);
    setTerminal((value) =>
      value ? { ...value, applicationLanguage: next } : value,
    );
  }

  async function unlock(session: StaffSession) {
    const current = terminal;
    const preferred = await loadStaffPreferredLanguage(session.staffProfileId);
    if (current) {
      await saveTerminalPreferences({
        terminalName: current.terminalName,
        clockFormat: current.clockFormat,
        receiptLanguage: current.receiptLanguage,
        applicationLanguage: preferred,
      });
    }
    await setTerminalLocked(false);
    setLanguage(preferred);
    setStaffSession(session);
    setTerminal((value) =>
      value
        ? { ...value, isLocked: false, applicationLanguage: preferred }
        : value,
    );
    resetScreens();
  }

  function updatePreferences(preferences: TerminalPreferences) {
    setTerminal((current) => current ? { ...current, ...preferences } : current);
  }

  if (!sessionReady) {
    return (
      <LocaleProvider language={language}>
      <main
        className={startupStyles.startup}
        data-olaso-startup="access"
        aria-label={translate(language, 'Loading Olaso')}
        aria-busy="true"
        role="status"
      >
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <StartupDots />
      </main>
      </LocaleProvider>
    );
  }

  async function requestStaffSwitch() {
    if (hasUnfinishedCart(posSession) && !window.confirm(
      translate(
        language,
        'Switch staff? The current order will stay for the next staff member.',
      ),
    )) return false;
    await lock();
    return true;
  }

  if (startupError || !terminal) {
    return (
      <LocaleProvider language={language}>
      <main className={startupStyles.startup} aria-label={translate(language, 'Terminal recovery')} role="alert">
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <strong>{translate(language, 'Terminal locked')}</strong>
        <span>{startupError ?? translate(language, 'Terminal settings are unavailable. POS remains locked.')}</span>
        <button type="button" onClick={() => void restoreTerminal()}>
          {translate(language, 'Retry terminal check')}
        </button>
      </main>
      </LocaleProvider>
    );
  }

  function openSettings() {
    openScreen('Settings');
  }

  async function printDailyReport() {
    if (!staffSession) return;
    const result = await printDailyOwnerReport(staffSession.name);
    if (!result.ok) {
      window.alert(translate(language, result.message));
    }
  }

  if (terminal.isLocked) {
    return (
      <LocaleProvider language={language}>
        <LockScreen settings={terminal} onUnlock={unlock} />
      </LocaleProvider>
    );
  }

  if (!staffSession) {
    return (
      <LocaleProvider language={language}>
      <main className={startupStyles.startup} aria-label={translate(language, 'Terminal locked')} role="alert">
        <img className={startupStyles.logo} src={olasoLogo} alt="OLASO" width={320} height={87} />
        <strong>{translate(language, 'Terminal locked')}</strong>
        <span>{translate(language, 'Staff session is unavailable. Lock and sign in again.')}</span>
        <button type="button" onClick={() => void lock()}>
          {translate(language, 'Lock terminal')}
        </button>
      </main>
      </LocaleProvider>
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
    <LocaleProvider language={language}>
    <StaffSessionProvider session={{ ...staffSession, deviceId: terminal.deviceId }}>
      <ReconnectProvider onSessionUnavailable={lock}>
        <div className={appStyles.shell}>
          <Header
            activePage={activeScreen === 'Settings' ? undefined : activeScreen}
            clockFormat={terminal.clockFormat}
            onNavigate={navigate}
            onOpenSettings={activeScreen === 'Settings' ? undefined : openSettings}
            onSwitchStaff={requestStaffSwitch}
            language={language}
            onLanguageChange={applyLanguage}
            onPrintDailyReport={staffSession.role === 'owner' ? printDailyReport : undefined}
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
                      onPreferencesChange={updatePreferences}
                      onLanguageChange={applyLanguage}
                    />
                  ) : visited === 'Dashboard' ? (
                    <DashboardScreen onNavigate={navigate} />
                  ) : visited === 'Orders' ? (
                    <OrdersScreen />
                  ) : visited === 'Products' ? (
                    <ProductsScreen />
                  ) : visited === 'Stock' ? (
                    <StockScreen initialLevelFilter={stockLevelFilter} />
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
    </LocaleProvider>
  );
}
