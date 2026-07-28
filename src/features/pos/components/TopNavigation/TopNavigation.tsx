import {
  ChartLineUp,
  Package,
  Receipt,
  ShoppingCart,
  SquaresFour,
  Stack,
} from '@phosphor-icons/react';
import styles from './TopNavigation.module.css';

const navigationItems = [
  { label: 'Dashboard', icon: SquaresFour },
  { label: 'POS', icon: ShoppingCart },
  { label: 'Orders', icon: Receipt },
  { label: 'Products', icon: Package },
  { label: 'Stock', icon: Stack },
  { label: 'Reports', icon: ChartLineUp },
] as const;

export type NavigationPage = (typeof navigationItems)[number]['label'];

interface TopNavigationProps {
  activePage: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
}

export function TopNavigation({ activePage, onNavigate }: TopNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      {navigationItems.map(({ label, icon: Icon }) => {
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
