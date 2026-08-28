import { useRef, type CSSProperties } from 'react';
import { ChartLine, Package, Receipt, Cart, Grid, Layers } from '@boxicons/react';
import styles from './TopNavigation.module.css';
import { hasPermission, type StaffRole } from '../../../../data/permissions';

const navigationItems = [
  { label: 'Dashboard', icon: Grid, permission: 'dashboard' },
  { label: 'POS', icon: Cart, permission: 'pos' },
  { label: 'Orders', icon: Receipt, permission: 'orders' },
  { label: 'Products', icon: Package, permission: 'products' },
  { label: 'Stock', icon: Layers, permission: 'stock' },
  { label: 'Reports', icon: ChartLine, permission: 'reports' },
] as const;

export type NavigationPage = (typeof navigationItems)[number]['label'];

interface TopNavigationProps {
  activePage?: NavigationPage;
  role: StaffRole;
  onNavigate?: (page: NavigationPage) => void;
}

export function TopNavigation({ activePage, onNavigate, role }: TopNavigationProps) {
  const visible = navigationItems.filter((item) => hasPermission(role, item.permission));
  const index = visible.findIndex((item) => item.label === activePage);
  const lastIndex = useRef(0);
  if (index >= 0) lastIndex.current = index;

  return (
    <nav
      className={styles.navigation}
      style={{
        '--count': visible.length,
        '--index': lastIndex.current,
        '--show': index < 0 ? 0 : 1,
      } as CSSProperties}
      aria-label="Primary navigation"
    >
      <span className={styles.indicator} aria-hidden="true" />
      {visible.map(({ label, icon: Icon }) => {
        const isActive = label === activePage;

        return (
          <button
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate?.(label)}
            key={label}
          >
            <Icon width={16} height={16} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
