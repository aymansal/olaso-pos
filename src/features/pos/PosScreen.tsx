import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { Header } from './components/Header/Header';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { ReceiptRail } from './components/ReceiptRail/ReceiptRail';
import { SearchField } from './components/SearchField/SearchField';
import styles from './PosScreen.module.css';

export function PosScreen() {
  return (
    <main className={styles.screen} aria-label="Olaso point of sale">
      <Header />
      <section className={styles.menu} aria-label="Product menu">
        <SearchField />
        <CategoryRow />
        <ProductGrid />
      </section>
      <ReceiptRail />
    </main>
  );
}
