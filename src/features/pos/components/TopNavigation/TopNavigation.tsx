import {
  ChartBar,
  Package,
  Receipt,
  ShoppingCartSimple,
  SquaresFour,
  Warehouse,
} from '@phosphor-icons/react';
import styles from './TopNavigation.module.css';

const navigationItems = [
  { label: 'Dashboard', icon: SquaresFour },
  { label: 'POS', icon: ShoppingCartSimple },
  { label: 'Orders', icon: Receipt },
  { label: 'Products', icon: Package },
  { label: 'Stock', icon: Warehouse },
  { label: 'Reports', icon: ChartBar },
] as const;

export function TopNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      {navigationItems.map(({ label, icon: Icon }) => {
        const isActive = label === 'POS';

        return (
          <button
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            type="button"
            aria-current={isActive ? 'page' : undefined}
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
