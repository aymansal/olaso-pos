import type { Dispatch, SetStateAction } from 'react';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { Header } from './components/Header/Header';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { ReceiptRail } from './components/ReceiptRail/ReceiptRail';
import { SearchField } from './components/SearchField/SearchField';
import type { NavigationPage } from './components/TopNavigation/TopNavigation';
import { products } from './data/products';
import {
  addProduct,
  decrementCartLine,
  filterProducts,
  incrementCartLine,
  removeCartLine,
  subtotalCentimes,
  taxCentimes,
  totalCentimes,
  validatePosSession,
  type PosSession,
} from './posSession';
import styles from './PosScreen.module.css';

const productById = new Map(products.map((product) => [product.id, product]));

interface PosScreenProps {
  session: PosSession;
  onSessionChange: Dispatch<SetStateAction<PosSession>>;
  onNavigate?: (page: NavigationPage) => void;
}

export function PosScreen({
  session,
  onSessionChange,
  onNavigate,
}: PosScreenProps) {
  function editSession(edit: (current: PosSession) => PosSession) {
    onSessionChange((current) => ({ ...edit(current), checkoutStatus: 'idle' }));
  }

  const visibleProducts = filterProducts(
    products,
    session.selectedCategoryId,
    session.query,
  );
  const receiptLines = session.cart.flatMap((line) => {
    const product = productById.get(line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const subtotal = subtotalCentimes(session.cart, products);
  const tax = taxCentimes(subtotal);
  const total = totalCentimes(subtotal, tax);
  const validation = validatePosSession(session, products);
  const checkoutFeedback: {
    kind: 'neutral' | 'error' | 'success';
    message: string;
  } = validation.kind === 'error'
    ? { kind: 'error', message: validation.message }
    : session.checkoutStatus === 'processing'
      ? { kind: 'neutral', message: 'Checking only — nothing is being saved.' }
      : session.checkoutStatus === 'success'
        ? { kind: 'success', message: 'Valid — ready for future local save; not recorded.' }
        : { kind: 'neutral', message: validation.message };

  async function checkOrder() {
    if (validation.kind !== 'valid') return;

    onSessionChange((current) => ({ ...current, checkoutStatus: 'processing' }));
    await new Promise((resolve) => setTimeout(resolve, 350));
    onSessionChange((current) =>
      current.checkoutStatus === 'processing'
        ? { ...current, checkoutStatus: 'success' }
        : current
    );
  }

  return (
    <main className={styles.screen} aria-label="Olaso point of sale">
      <Header activePage="POS" onNavigate={onNavigate} />
      <section className={styles.menu} aria-label="Product menu">
        <SearchField
          value={session.query}
          onChange={(query) => editSession((current) => ({ ...current, query }))}
        />
        <CategoryRow
          selectedCategoryId={session.selectedCategoryId}
          onSelect={(selectedCategoryId) =>
            editSession((current) => ({ ...current, selectedCategoryId }))}
        />
        <ProductGrid
          products={visibleProducts}
          onAdd={(productId) =>
            editSession((current) => ({
              ...current,
              cart: addProduct(current.cart, productId),
            }))}
        />
      </section>
      <ReceiptRail
        lines={receiptLines}
        subtotalCentimes={subtotal}
        taxCentimes={tax}
        totalCentimes={total}
        serviceMode={session.serviceMode}
        customerName={session.customerName}
        table={session.table}
        checkoutFeedback={checkoutFeedback}
        checkoutDisabled={
          validation.kind !== 'valid' || session.checkoutStatus === 'processing'
        }
        checkoutProcessing={session.checkoutStatus === 'processing'}
        onDecrement={(productId) =>
          editSession((current) => ({
            ...current,
            cart: decrementCartLine(current.cart, productId),
          }))}
        onIncrement={(productId) =>
          editSession((current) => ({
            ...current,
            cart: incrementCartLine(current.cart, productId),
          }))}
        onRemove={(productId) =>
          editSession((current) => ({
            ...current,
            cart: removeCartLine(current.cart, productId),
          }))}
        onServiceModeChange={(serviceMode) =>
          editSession((current) => ({ ...current, serviceMode }))}
        onCustomerNameChange={(customerName) =>
          editSession((current) => ({ ...current, customerName }))}
        onTableChange={(table) =>
          editSession((current) => ({ ...current, table }))}
        onCheckOrder={checkOrder}
      />
    </main>
  );
}
