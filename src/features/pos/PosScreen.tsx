import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { ReceiptPreviewDialog } from '../../components/ReceiptPreviewDialog/ReceiptPreviewDialog';
import { usePosData } from '../../data/usePosData';
import { useConnectionStatus } from '../../data/connectionContext';
import type { ClockFormat } from '../../data/terminalSettings';
import type { SavedReceipt } from '../../data/localSales.ts';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { Header } from './components/Header/Header';
import {
  ModifierSelectionDialog,
  type PosModifierGroup,
} from './components/ModifierSelectionDialog/ModifierSelectionDialog';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { ReceiptRail } from './components/ReceiptRail/ReceiptRail';
import { SearchField } from './components/SearchField/SearchField';
import type { NavigationPage } from './components/TopNavigation/TopNavigation';
import { categoryImage, type Category } from './data/categories';
import { productImage, type Product } from './data/products';
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
  type ServiceMode,
} from './posSession';
import styles from './PosScreen.module.css';

interface PosScreenProps {
  session: PosSession;
  onSessionChange: Dispatch<SetStateAction<PosSession>>;
  clockFormat: ClockFormat;
  onNavigate?: (page: NavigationPage) => void;
  onOpenSettings?: () => void;
}

function localServiceType(
  serviceMode: ServiceMode,
): 'dine-in' | 'take-away' {
  if (serviceMode === 'Dine In') return 'dine-in';
  return 'take-away';
}

export function PosScreen({
  session,
  onSessionChange,
  clockFormat,
  onNavigate,
  onOpenSettings,
}: PosScreenProps) {
  const { available } = useConnectionStatus();
  const {
    menu,
    completeOrder,
    printFeedback,
    receiptLanguage,
    isLoading,
    error: dataWarning,
  } = usePosData();
  const [configuringProductId, setConfiguringProductId] = useState<string>();
  const [receiptPreview, setReceiptPreview] = useState<SavedReceipt>();
  const [checkoutError, setCheckoutError] = useState('');

  function editSession(edit: (current: PosSession) => PosSession) {
    setCheckoutError('');
    onSessionChange((current) => ({ ...edit(current), checkoutStatus: 'idle' }));
  }

  const categoryKeyById = useMemo(
    () => new Map(menu?.categories.map((category) => [category.id, category.key])),
    [menu],
  );
  const categories: Category[] = useMemo(
    () =>
      (menu?.categories ?? []).filter(
        (category) => category.status !== 'archived',
      ).map((category) => ({
        id: category.key,
        name: category.name,
        count:
          menu?.products.filter(
            (product) =>
              product.categoryId === category.id
              && product.status === 'active',
          ).length ?? 0,
        status: 'Available',
        variant: 'default',
        image: categoryImage(category.key),
      })),
    [menu],
  );
  const products: Product[] = useMemo(
    () =>
      (menu?.products ?? [])
        .filter((product) => product.status === 'active')
        .map((product) => {
          const categoryKey = categoryKeyById.get(product.categoryId) ?? '';
          return {
            id: product.id,
            categoryId: categoryKey,
            name: product.name,
            priceCentimes: product.priceCentimes,
            image: productImage(product.imageAssetKey, categoryKey),
          };
        }),
    [categoryKeyById, menu],
  );
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const optionById = useMemo(
    () => new Map(menu?.modifierOptions.map((option) => [option.id, option])),
    [menu],
  );

  useEffect(() => {
    if (
      categories[0]
      && !categories.some((category) => category.id === session.selectedCategoryId)
    ) {
      onSessionChange((current) => ({
        ...current,
        selectedCategoryId: categories[0].id,
        checkoutStatus: 'idle',
      }));
    }
  }, [categories, onSessionChange, session.selectedCategoryId]);

  const visibleProducts = filterProducts(
    products,
    session.selectedCategoryId,
    session.query,
  );
  const receiptLines = session.cart.flatMap((line) => {
    const product = productById.get(line.productId);
    if (!product) return [];
    const selectedOptions = line.modifierOptionIds.flatMap((id) => {
      const option = optionById.get(id);
      return option ? [option] : [];
    });
    return [{
      id: line.id,
      product: {
        ...product,
        priceCentimes:
          product.priceCentimes
          + selectedOptions.reduce(
            (sum, option) => sum + option.priceDeltaCentimes,
            0,
          ),
      },
      quantity: line.quantity,
      modifierSummary: selectedOptions
        .map((option) => option.name)
        .join(', '),
    }];
  });
  let subtotal = 0;
  try {
    subtotal = subtotalCentimes(
      session.cart,
      products,
      menu?.modifierOptions ?? [],
    );
  } catch {
    subtotal = 0;
  }
  const tax = taxCentimes(subtotal);
  const total = totalCentimes(subtotal, tax);
  const validation = validatePosSession(
    session,
    products,
    menu?.modifierOptions ?? [],
  );
  const checkoutFeedback: {
    kind: 'neutral' | 'error' | 'success';
    message: string;
  } = checkoutError
    ? { kind: 'error', message: checkoutError }
    : session.checkoutStatus === 'processing'
      ? { kind: 'neutral', message: 'Saving this order on the tablet…' }
      : session.checkoutStatus === 'success'
        ? printFeedback ?? {
            kind: 'success',
            message: 'Sale saved. Receipt remains pending.',
          }
        : available === false
          ? { kind: 'neutral', message: 'Offline · sales stay saved on this tablet.' }
          : dataWarning
          ? { kind: 'neutral', message: dataWarning }
          : validation.kind === 'error'
            ? { kind: 'error', message: validation.message }
            : { kind: 'neutral', message: validation.message };

  const configuringProduct = configuringProductId
    ? productById.get(configuringProductId)
    : undefined;
  const configuringGroups: PosModifierGroup[] = useMemo(() => {
    if (!menu || !configuringProductId) return [];
    return menu.productModifierGroups
      .filter((link) => link.productId === configuringProductId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .flatMap((link) => {
        const group = menu.modifierGroups.find(
          (candidate) => candidate.id === link.modifierGroupId,
        );
        return group
          ? [{
              id: group.id,
              name: group.name,
              minimumSelections: group.minimumSelections,
              maximumSelections: group.maximumSelections,
              options: menu.modifierOptions
                .filter((option) => option.modifierGroupId === group.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((option) => ({
                  id: option.id,
                  name: option.name,
                  priceDeltaCentimes: option.priceDeltaCentimes,
                })),
            }]
          : [];
      });
  }, [configuringProductId, menu]);

  function beginAdd(productId: string) {
    const hasModifiers = menu?.productModifierGroups.some(
      (link) => link.productId === productId,
    );
    if (hasModifiers) {
      setConfiguringProductId(productId);
      return;
    }
    editSession((current) => ({
      ...current,
      cart: addProduct(current.cart, productId),
    }));
  }

  async function placeOrder() {
    if (validation.kind !== 'valid') return;
    setCheckoutError('');
    onSessionChange((current) => ({ ...current, checkoutStatus: 'processing' }));
    try {
      const result = await completeOrder({
        cart: session.cart,
        serviceType: localServiceType(session.serviceMode),
        paymentMethod: session.paymentMethod,
        receiptLanguage,
      });
      setReceiptPreview(result.receipt);
      onSessionChange((current) => ({
        ...current,
        cart: [],
        checkoutStatus: 'success',
      }));
    } catch (caught) {
      setCheckoutError(
        caught instanceof Error ? caught.message : 'The order could not be saved.',
      );
      onSessionChange((current) => ({
        ...current,
        checkoutStatus: 'idle',
      }));
    }
  }

  return (
    <main className={styles.screen} aria-label="Olaso point of sale">
      <Header
        activePage="POS"
        clockFormat={clockFormat}
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      />
      <section className={styles.menu} aria-label="Product menu">
        <SearchField
          value={session.query}
          onChange={(query) => editSession((current) => ({ ...current, query }))}
        />
        <CategoryRow
          categories={categories}
          selectedCategoryId={session.selectedCategoryId}
          onSelect={(selectedCategoryId) =>
            editSession((current) => ({ ...current, selectedCategoryId }))}
        />
        <ProductGrid
          products={visibleProducts}
          emptyMessage={
            isLoading
              ? 'Loading the saved menu…'
              : dataWarning && products.length === 0
                ? dataWarning
                : 'No products match this category and search.'
          }
          onAdd={beginAdd}
        />
      </section>
      <ReceiptRail
        lines={receiptLines}
        subtotalCentimes={subtotal}
        taxCentimes={tax}
        totalCentimes={total}
        serviceMode={session.serviceMode}
        paymentMethod={session.paymentMethod}
        checkoutFeedback={checkoutFeedback}
        checkoutDisabled={
          validation.kind !== 'valid' || session.checkoutStatus === 'processing'
        }
        checkoutProcessing={session.checkoutStatus === 'processing'}
        onDecrement={(lineId) =>
          editSession((current) => ({
            ...current,
            cart: decrementCartLine(current.cart, lineId),
          }))}
        onIncrement={(lineId) =>
          editSession((current) => ({
            ...current,
            cart: incrementCartLine(current.cart, lineId),
          }))}
        onRemove={(lineId) =>
          editSession((current) => ({
            ...current,
            cart: removeCartLine(current.cart, lineId),
          }))}
        onServiceModeChange={(serviceMode) =>
          editSession((current) => ({ ...current, serviceMode }))}
        onPaymentMethodChange={(paymentMethod) =>
          editSession((current) => ({ ...current, paymentMethod }))}
        onPlaceOrder={placeOrder}
      />
      {configuringProduct ? (
        <ModifierSelectionDialog
          productName={configuringProduct.name}
          basePriceCentimes={configuringProduct.priceCentimes}
          groups={configuringGroups}
          onClose={() => setConfiguringProductId(undefined)}
          onAdd={(modifierOptionIds) => {
            editSession((current) => ({
              ...current,
              cart: addProduct(
                current.cart,
                configuringProduct.id,
                modifierOptionIds,
              ),
            }));
            setConfiguringProductId(undefined);
          }}
        />
      ) : null}
      {receiptPreview ? (
        <ReceiptPreviewDialog
          receipt={receiptPreview}
          onClose={() => setReceiptPreview(undefined)}
        />
      ) : null}
    </main>
  );
}
