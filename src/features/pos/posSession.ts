import type { CategoryId } from './data/categories';

export type ServiceMode = 'Dine In' | 'Take Away' | 'Order Online';

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  modifierOptionIds: string[];
};

export type PosSession = {
  query: string;
  selectedCategoryId: CategoryId;
  cart: CartLine[];
  serviceMode: ServiceMode;
  customerName: string;
  table: string;
  checkoutStatus: 'idle' | 'processing' | 'success';
};

type PricedProduct = {
  id: string;
  priceCentimes: number;
};

type PricedModifierOption = {
  id: string;
  priceDeltaCentimes: number;
};

type FilterableProduct = {
  categoryId: CategoryId;
  name: string;
};

export const TEMPORARY_TAX_RATE_BASIS_POINTS = 0;

export function createInitialPosSession(): PosSession {
  return {
    query: '',
    selectedCategoryId: 'coffee',
    cart: [],
    serviceMode: 'Dine In',
    customerName: '',
    table: '',
    checkoutStatus: 'idle',
  };
}

export function addProduct(
  cart: CartLine[],
  productId: string,
  modifierOptionIds: string[] = [],
): CartLine[] {
  const normalizedOptions = [...new Set(modifierOptionIds)].sort();
  const id = JSON.stringify([productId, normalizedOptions]);
  const existing = cart.find((line) => line.id === id);

  return existing
    ? cart.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line)
    : [
        ...cart,
        {
          id,
          productId,
          quantity: 1,
          modifierOptionIds: normalizedOptions,
        },
      ];
}

export function filterProducts<T extends FilterableProduct>(
  products: readonly T[],
  categoryId: CategoryId,
  query: string,
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return products.filter((product) =>
    product.categoryId === categoryId
    && product.name.toLocaleLowerCase().includes(normalizedQuery)
  );
}

export function incrementCartLine(cart: CartLine[], lineId: string): CartLine[] {
  return cart.map((line) =>
    line.id === lineId ? { ...line, quantity: line.quantity + 1 } : line
  );
}

export function decrementCartLine(cart: CartLine[], lineId: string): CartLine[] {
  return cart.map((line) =>
    line.id === lineId && line.quantity > 1
      ? { ...line, quantity: line.quantity - 1 }
      : line
  );
}

export function removeCartLine(cart: CartLine[], lineId: string): CartLine[] {
  return cart.filter((line) => line.id !== lineId);
}

export function subtotalCentimes(
  cart: CartLine[],
  products: readonly PricedProduct[],
  modifierOptions: readonly PricedModifierOption[] = [],
): number {
  const prices = new Map(products.map((product) => [product.id, product.priceCentimes]));
  const optionPrices = new Map(
    modifierOptions.map((option) => [option.id, option.priceDeltaCentimes]),
  );

  return cart.reduce((subtotal, line) => {
    const basePrice = prices.get(line.productId);
    const modifierPrice = line.modifierOptionIds.reduce((sum, optionId) => {
      const price = optionPrices.get(optionId);
      if (price === undefined) throw new Error(`Invalid modifier: ${optionId}`);
      return sum + price;
    }, 0);

    if (
      basePrice === undefined
      || !Number.isInteger(line.quantity)
      || line.quantity < 1
      || basePrice + modifierPrice < 0
    ) {
      throw new Error(`Invalid cart line: ${line.productId}`);
    }

    return subtotal + (basePrice + modifierPrice) * line.quantity;
  }, 0);
}

export function validatePosSession(
  session: PosSession,
  products: readonly PricedProduct[],
  modifierOptions: readonly PricedModifierOption[] = [],
): { kind: 'empty' | 'error' | 'valid'; message: string } {
  if (session.cart.length === 0) {
    return { kind: 'empty', message: 'Add a product to begin.' };
  }

  try {
    subtotalCentimes(session.cart, products, modifierOptions);
  } catch {
    return { kind: 'error', message: 'The order contains an invalid product or quantity.' };
  }

  if (session.serviceMode === 'Dine In' && session.table.trim() === '') {
    return { kind: 'error', message: 'Table is required for dine in.' };
  }

  return { kind: 'valid', message: 'Ready to place the order.' };
}

export function taxCentimes(
  subtotal: number,
  rateBasisPoints = TEMPORARY_TAX_RATE_BASIS_POINTS,
): number {
  return Math.round(subtotal * rateBasisPoints / 10_000);
}

export function totalCentimes(subtotal: number, tax: number): number {
  return subtotal + tax;
}
