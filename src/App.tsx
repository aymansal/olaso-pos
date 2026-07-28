import { useState } from 'react';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { PosScreen } from './features/pos/PosScreen';
import type { NavigationPage } from './features/pos/components/TopNavigation/TopNavigation';
import { createInitialPosSession } from './features/pos/posSession';
import { ProductsScreen } from './features/products/ProductsScreen';
import { ReportsScreen } from './features/reports/ReportsScreen';
import { StockScreen } from './features/stock/StockScreen';

export function App() {
  const [screen, setScreen] = useState<NavigationPage>('POS');
  const [posSession, setPosSession] = useState(createInitialPosSession);

  function navigate(page: NavigationPage) {
    setScreen(page);
  }

  if (screen === 'Dashboard') {
    return <DashboardScreen onNavigate={navigate} />;
  }

  if (screen === 'Orders') {
    return <OrdersScreen onNavigate={navigate} />;
  }

  if (screen === 'Products') {
    return <ProductsScreen onNavigate={navigate} />;
  }

  if (screen === 'Stock') {
    return <StockScreen onNavigate={navigate} />;
  }

  if (screen === 'Reports') {
    return <ReportsScreen onNavigate={navigate} />;
  }

  return (
    <PosScreen
      session={posSession}
      onSessionChange={setPosSession}
      onNavigate={navigate}
    />
  );
}
