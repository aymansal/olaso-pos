import {
  ChartLineUp,
  Package,
  Receipt,
  ShoppingCart,
  SquaresFour,
  Stack,
} from '@phosphor-icons/react';
import styles from './TopNavigation.module.css';
import { hasPermission, type StaffRole } from '../../../../data/permissions';

const navigationItems = [
  { label: 'Dashboard', icon: SquaresFour, permission: 'dashboard' },
  { label: 'POS', icon: ShoppingCart, permission: 'pos' },
  { label: 'Orders', icon: Receipt, permission: 'orders' },
  { label: 'Products', icon: Package, permission: 'products' },
  { label: 'Stock', icon: Stack, permission: 'stock' },
  { label: 'Reports', icon: ChartLineUp, permission: 'reports' },
] as const;

export type NavigationPage = (typeof navigationItems)[number]['label'];

interface TopNavigationProps {
  activePage?: NavigationPage;
  role: StaffRole;
  onNavigate?: (page: NavigationPage) => void;
}

export function TopNavigation({ activePage, onNavigate, role }: TopNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      {navigationItems.filter((item) => hasPermission(role, item.permission)).map(({ label, icon: Icon }) => {
        const isActive = label === activePage;

        return (
          <button
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate?.(label)}
            key={label}
          >
            <Icon size={16} weight="regular" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
