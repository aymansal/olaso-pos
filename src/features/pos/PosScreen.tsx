import {
  Activity,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { usePosData } from '../../data/usePosData';
import { useConnectionStatus } from '../../data/connectionContext';
import { useT } from '../../lib/locale';
import type { ReceiptLanguage } from '../../data/terminalSettings';
import type { OperationalCacheSnapshot } from '../../data/operationalCache.ts';
import { categoryArtworkUrl } from '../../lib/categoryArtwork.ts';
import { CategoryRow } from './components/CategoryRow/CategoryRow';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { QuickAddRow } from './components/QuickAddRow/QuickAddRow';
import { ReceiptRail } from './components/ReceiptRail/ReceiptRail';
import { SearchField } from './components/SearchField/SearchField';
import {
  ModifierSelectionDialog,
  type PosChoiceSection,
  type PosProductSize,
} from './components/ModifierSelectionDialog/ModifierSelectionDialog';
import { PaymentDialog } from './components/PaymentDialog/PaymentDialog';
import type { Category } from './data/categories';
import type { Product } from './data/products';
import { productImage } from '../../lib/productImage';
import {
  addProduct,
  complimentaryCentimes,
  decrementCartLine,
  filterProducts,
  incrementCartLine,
  paidUnitCount,
  removeCartLine,
  subtotalCentimes,
  toggleCartLineOffert,
  validatePosSession,
  type PaymentTender,
  type PosSession,
  type ServiceMode,
} from './posSession';
import styles from './PosScreen.module.css';

interface PosScreenProps {
  session: PosSession;
  onSessionChange: Dispatch<SetStateAction<PosSession>>;
  receiptLanguage: ReceiptLanguage;
}

function localServiceType(
  serviceMode: ServiceMode,
): 'dine-in' | 'take-away' {
  if (serviceMode === 'Dine In') return 'dine-in';
  return 'take-away';
}

function activeSizesForProduct(
  menu: OperationalCacheSnapshot,
  productId: string,
): PosProductSize[] {
  return menu.productSizes
    .filter((size) => size.productId === productId && size.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((size) => ({
      id: size.id,
      name: size.name,
      priceCentimes: size.priceCentimes,
      isDefault: size.isDefault,
    }));
}

function choiceSectionsForProduct(
  menu: OperationalCacheSnapshot,
  productId: string,
): PosChoiceSection[] {
  return menu.productChoiceSections
    .filter((section) =>
      section.productId === productId && section.status === 'active',
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((section) => ({
      id: section.id,
      name: section.name,
      required: section.required,
      min: section.minimumSelections,
      max: section.maximumSelections,
      selectionMode: section.selectionMode,
      applicableSizeIds: menu.productChoiceSectionSizes
        .filter((link) => link.sectionId === section.id)
        .map((link) => link.productSizeId),
      values: menu.productChoiceValues
        .filter((value) =>
          value.sectionId === section.id && value.status === 'active',
        )
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
        .map((value) => ({
          id: value.id,
          name: value.name,
          priceDeltaCentimes: value.priceDeltaCentimes,
          isDefaultSelected: value.isDefaultSelected,
          sizeRules: menu.productChoiceValueSizes
            .filter((rule) => rule.valueId === value.id)
            .map((rule) => ({
              sizeId: rule.productSizeId,
              available: rule.available,
              priceDeltaCentimes: rule.priceDeltaCentimes,
            })),
        })),
    }));
}

function sectionAppliesToSize(
  section: PosChoiceSection,
  sizeId: string,
) {
  return (
    section.applicableSizeIds.length === 0
    || section.applicableSizeIds.includes(sizeId)
  );
}

function defaultChoiceValueIds(
  sizeId: string,
  sections: PosChoiceSection[],
) {
  const selected: string[] = [];
  for (const section of sections.filter((row) =>
    sectionAppliesToSize(row, sizeId),
  )) {
    const defaults = section.values.filter((value) => {
      if (!value.isDefaultSelected) return false;
      const rule = value.sizeRules.find((row) => row.sizeId === sizeId);
      return !rule || rule.available;
    });
    if (section.max === 1) {
      if (defaults[0]) selected.push(defaults[0].id);
    } else {
      for (const value of defaults.slice(0, section.max)) {
        selected.push(value.id);
      }
    }
  }
  return selected;
}

function choiceDeltaForSize(
  menu: OperationalCacheSnapshot,
  valueId: string,
  sizeId: string,
) {
  const value = menu.productChoiceValues.find((row) => row.id === valueId);
  if (!value) return undefined;
  const rule = menu.productChoiceValueSizes.find(
    (row) => row.valueId === valueId && row.productSizeId === sizeId,
  );
  return rule?.priceDeltaCentimes ?? value.priceDeltaCentimes;
}

export function PosScreen({
  session,
  onSessionChange,
  receiptLanguage,
}: PosScreenProps) {
  const t = useT();
  const { available } = useConnectionStatus();
  const {
    menu,
    quickAddProductIds,
    completeOrder,
    printFeedback,
    isLoading,
    error: dataWarning,
  } = usePosData();
  const [configuringProductId, setConfiguringProductId] = useState<string>();
  const [paying, setPaying] = useState(false);
  const [payingSplit, setPayingSplit] = useState(false);
  const checkoutInFlight = useRef(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [visitedCategoryIds, setVisitedCategoryIds] = useState<string[]>(
    () => [session.selectedCategoryId],
  );

  function editSession(edit: (current: PosSession) => PosSession) {
    setCheckoutError('');
    onSessionChange((current) => ({ ...edit(current), checkoutStatus: 'idle' }));
  }

  const categoryKeyById = useMemo(
    () => new Map(menu?.categories.map((category) => [category.id, category.key])),
    [menu],
  );
  const categoryArtworkKeyById = useMemo(
    () => new Map(menu?.categories.map((category) => [category.id, category.artworkKey])),
    [menu],
  );
  const categories: Category[] = useMemo(
    () =>
      [...(menu?.categories ?? []).filter(
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
        status: 'Available' as const,
        variant: 'default' as const,
        image: categoryArtworkUrl(category.artworkKey),
      })), ...(() => {
        const count = (menu?.products ?? []).filter(
          (product) => !product.categoryId && product.status === 'active',
        ).length;
        return count ? [{
          id: 'uncategorized',
          name: 'Uncategorized',
          count,
          status: 'Available' as const,
          variant: 'default' as const,
          image: categoryArtworkUrl(),
        }] : [];
      })()],
    [menu],
  );
  const products: Product[] = useMemo(
    () =>
      (menu?.products ?? [])
        .filter((product) => product.status === 'active')
        .map((product) => {
          const categoryKey = categoryKeyById.get(product.categoryId)
            ?? 'uncategorized';
          const categoryArtworkKey = categoryArtworkKeyById.get(product.categoryId);
          return {
            id: product.id,
            categoryId: categoryKey,
            name: product.name,
            priceCentimes: product.priceCentimes,
            image: productImage(
              product.imageAssetKey,
              categoryArtworkKey,
              product.imageJpeg,
            ),
          };
        }),
    [categoryArtworkKeyById, categoryKeyById, menu],
  );
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const quickAddProducts = useMemo(
    () => quickAddProductIds.flatMap((productId) => {
      const product = productById.get(productId);
      return product ? [product] : [];
    }),
    [productById, quickAddProductIds],
  );
  const sizeById = useMemo(
    () => new Map((menu?.productSizes ?? []).map((size) => [size.id, size])),
    [menu],
  );
  const valueById = useMemo(
    () => new Map(
      (menu?.productChoiceValues ?? []).map((value) => [value.id, value]),
    ),
    [menu],
  );
  const pricedSizes = useMemo(
    () => (menu?.productSizes ?? []).map((size) => ({
      id: size.id,
      priceCentimes: size.priceCentimes,
    })),
    [menu],
  );
  const pricedChoiceValues = useMemo(() => {
    if (!menu) return [];
    return session.cart.flatMap((line) =>
      line.choiceValueIds.flatMap((valueId) => {
        const delta = choiceDeltaForSize(menu, valueId, line.sizeId);
        return delta === undefined
          ? []
          : [{ id: valueId, sizeId: line.sizeId, priceDeltaCentimes: delta }];
      }),
    );
  }, [menu, session.cart]);

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

  const retainedCategoryIds = [
    ...new Set([...visitedCategoryIds, session.selectedCategoryId]),
  ].filter((categoryId) =>
    categoryId === session.selectedCategoryId
    || categories.some((category) => category.id === categoryId),
  );
  const receiptLines = session.cart.flatMap((line) => {
    const product = productById.get(line.productId);
    const size = sizeById.get(line.sizeId);
    if (!product || !size || !menu) return [];
    const selectedValues = line.choiceValueIds.flatMap((id) => {
      const value = valueById.get(id);
      if (!value) return [];
      const delta = choiceDeltaForSize(menu, id, line.sizeId);
      if (delta === undefined) return [];
      return [{ ...value, priceDeltaCentimes: delta }];
    });
    const meta = [
      size.name,
      ...selectedValues.map((value) => value.name),
    ].filter(Boolean).join(', ');
    return [{
      id: line.id,
      product: {
        ...product,
        priceCentimes:
          size.priceCentimes
          + selectedValues.reduce(
            (sum, value) => sum + value.priceDeltaCentimes,
            0,
          ),
      },
      quantity: line.quantity,
      modifierSummary: meta,
      complimentary: line.complimentary === true,
    }];
  });
  let subtotal = 0;
  let offert = 0;
  try {
    subtotal = subtotalCentimes(
      session.cart,
      pricedSizes,
      pricedChoiceValues,
    );
    offert = complimentaryCentimes(
      session.cart,
      pricedSizes,
      pricedChoiceValues,
    );
  } catch {
    subtotal = 0;
    offert = 0;
  }
  const total = subtotal - offert;
  const validation = isLoading
    ? { kind: 'empty' as const, message: 'Loading the saved menu…' }
    : validatePosSession(
      session,
      pricedSizes,
      pricedChoiceValues,
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
  const configuringSizes = useMemo(
    () =>
      menu && configuringProductId
        ? activeSizesForProduct(menu, configuringProductId)
        : [],
    [configuringProductId, menu],
  );
  const configuringSections = useMemo(
    () =>
      menu && configuringProductId
        ? choiceSectionsForProduct(menu, configuringProductId)
        : [],
    [configuringProductId, menu],
  );

  function beginAdd(productId: string) {
    if (!menu) return;
    const sizes = activeSizesForProduct(menu, productId);
    if (sizes.length === 0) return;
    const sections = choiceSectionsForProduct(menu, productId);
    const needsDialog =
      sizes.length > 1
      || sections.some((section) =>
        sizes.some((size) => sectionAppliesToSize(section, size.id)),
      );
    if (needsDialog) {
      setConfiguringProductId(productId);
      return;
    }
    const sizeId = sizes.find((size) => size.isDefault)?.id ?? sizes[0].id;
    const choiceValueIds = defaultChoiceValueIds(sizeId, sections);
    editSession((current) => ({
      ...current,
      cart: addProduct(current.cart, productId, sizeId, choiceValueIds),
    }));
  }

  async function placeOrder() {
    if (validation.kind !== 'valid') return;
    setCheckoutError('');
    if (total === 0) {
      await confirmPayment();
      return;
    }
    if (session.paymentMethod === 'Card') {
      await confirmPayment();
      return;
    }
    setPaying(true);
  }

  async function confirmPayment(tenders?: PaymentTender[]) {
    if (validation.kind !== 'valid' || checkoutInFlight.current) return;
    checkoutInFlight.current = true;
    setCheckoutError('');
    onSessionChange((current) => ({ ...current, checkoutStatus: 'processing' }));
    try {
      const savedTenders = tenders ?? (total > 0 ? [{
        paymentMethod: session.paymentMethod,
        dueCentimes: total,
        amountCentimes: total,
        changeCentimes: 0,
      }] : undefined);
      const result = await completeOrder({
        cart: session.cart,
        serviceType: localServiceType(session.serviceMode),
        paymentMethod: session.paymentMethod,
        receiptLanguage,
        ...(savedTenders ? { tenders: savedTenders } : {}),
      });
      setPaying(false);
      setPayingSplit(false);
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
    } finally {
      checkoutInFlight.current = false;
    }
  }

  return (
    <main className={styles.screen} aria-label={t('Olaso point of sale')}>
      <section className={styles.menu} aria-label={t('Product menu')}>
        <SearchField
          value={session.query}
          onChange={(query) => editSession((current) => ({ ...current, query }))}
        />
        <QuickAddRow products={quickAddProducts} onAdd={beginAdd} />
        <CategoryRow
          categories={categories}
          selectedCategoryId={session.selectedCategoryId}
          onSelect={(selectedCategoryId) => {
            setVisitedCategoryIds((current) =>
              current.includes(selectedCategoryId)
                ? current
                : [...current, selectedCategoryId],
            );
            editSession((current) => ({ ...current, selectedCategoryId }));
          }}
        />
        {retainedCategoryIds.map((categoryId) => (
          <Activity
            key={categoryId}
            mode={categoryId === session.selectedCategoryId ? 'visible' : 'hidden'}
          >
            <ProductGrid
              products={filterProducts(products, categoryId, session.query)}
              emptyMessage={
                isLoading
                  ? 'Loading the saved menu…'
                  : dataWarning && products.length === 0
                    ? dataWarning
                    : 'No products match this category and search.'
              }
              onAdd={beginAdd}
            />
          </Activity>
        ))}
      </section>
      <ReceiptRail
        lines={receiptLines}
        subtotalCentimes={subtotal}
        offertCentimes={offert}
        totalCentimes={total}
        serviceMode={session.serviceMode}
        paymentMethod={session.paymentMethod}
        checkoutFeedback={checkoutFeedback}
        checkoutDisabled={
          validation.kind !== 'valid'
          || session.checkoutStatus === 'processing'
          || paying
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
        onToggleOffert={(lineId) =>
          editSession((current) => ({
            ...current,
            cart: toggleCartLineOffert(current.cart, lineId),
          }))}
        onClearCart={() =>
          editSession((current) => ({ ...current, cart: [] }))}
        onServiceModeChange={(serviceMode) =>
          editSession((current) => ({ ...current, serviceMode }))}
        onPaymentMethodChange={(paymentMethod) =>
          editSession((current) => ({ ...current, paymentMethod }))}
        onPlaceOrder={placeOrder}
        canSplit={paidUnitCount(session.cart) > 1}
        onSplit={() => {
          if (validation.kind !== 'valid' || checkoutInFlight.current || paidUnitCount(session.cart) <= 1) return;
          setCheckoutError('');
          setPayingSplit(true);
          setPaying(true);
        }}
      />
      {configuringProduct && configuringSizes.length > 0 ? (
        <ModifierSelectionDialog
          productName={configuringProduct.name}
          sizes={configuringSizes}
          sections={configuringSections}
          onClose={() => setConfiguringProductId(undefined)}
          onAdd={({ sizeId, choiceValueIds }) => {
            editSession((current) => ({
              ...current,
              cart: addProduct(
                current.cart,
                configuringProduct.id,
                sizeId,
                choiceValueIds,
              ),
            }));
            setConfiguringProductId(undefined);
          }}
        />
      ) : null}
      {paying ? (
        <PaymentDialog
          cart={session.cart}
          labels={Object.fromEntries(
            receiptLines.map((line) => [
              line.id,
              {
                name: line.product.name,
                ...(line.modifierSummary
                  ? { detail: line.modifierSummary }
                  : {}),
                unitPriceCentimes: line.product.priceCentimes,
              },
            ]),
          )}
          paymentMethod={session.paymentMethod}
          sizes={pricedSizes}
          choiceValues={pricedChoiceValues}
          canSplit={paidUnitCount(session.cart) > 1}
          startSplit={payingSplit}
          processing={session.checkoutStatus === 'processing'}
          onCancel={() => {
            setPaying(false);
            setPayingSplit(false);
          }}
          onConfirm={confirmPayment}
        />
      ) : null}
    </main>
  );
}
