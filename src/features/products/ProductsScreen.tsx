import { Header } from '../pos/components/Header/Header';
import type { NavigationPage } from '../pos/components/TopNavigation/TopNavigation';
import { ProductCatalogPanel } from './components/ProductCatalogPanel/ProductCatalogPanel';
import { ProductEditorPanel } from './components/ProductEditorPanel/ProductEditorPanel';
import styles from './ProductsScreen.module.css';

interface ProductsScreenProps {
  onNavigate?: (page: NavigationPage) => void;
}

export function ProductsScreen({ onNavigate }: ProductsScreenProps) {
  return (
    <main className={styles.screen} aria-label="Olaso products">
      <Header
        activePage="Products"
        brand="olaso"
        dateLabel="Friday, 24 July"
        dateTime="2026-07-24"
        onNavigate={onNavigate}
      />
      <ProductCatalogPanel />
      <ProductEditorPanel />
    </main>
  );
}
