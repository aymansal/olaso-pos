import type { CategoryId } from './data/categories';

export type ServiceMode = 'Dine In' | 'Take Away' | 'Order Online';

export type CartLine = {
  productId: string;
  quantity: number;
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

type FilterableProduct = {
  categoryId: CategoryId;
  name: string;
};

export const TEMPORARY_TAX_RATE_BASIS_POINTS = 0;

const moneyFormatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
});

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

export function addProduct(cart: CartLine[], productId: string): CartLine[] {
  const existing = cart.find((line) => line.productId === productId);

  return existing
    ? cart.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line)
    : [...cart, { productId, quantity: 1 }];
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

export function incrementCartLine(cart: CartLine[], productId: string): CartLine[] {
  return cart.map((line) =>
    line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line
  );
}

export function decrementCartLine(cart: CartLine[], productId: string): CartLine[] {
  return cart.map((line) =>
    line.productId === productId && line.quantity > 1
      ? { ...line, quantity: line.quantity - 1 }
      : line
  );
}

export function removeCartLine(cart: CartLine[], productId: string): CartLine[] {
  return cart.filter((line) => line.productId !== productId);
}

export function subtotalCentimes(
  cart: CartLine[],
  products: readonly PricedProduct[],
): number {
  const prices = new Map(products.map((product) => [product.id, product.priceCentimes]));

  return cart.reduce((subtotal, line) => {
    const price = prices.get(line.productId);

    if (price === undefined || !Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new Error(`Invalid cart line: ${line.productId}`);
    }

    return subtotal + price * line.quantity;
  }, 0);
}

export function validatePosSession(
  session: PosSession,
  products: readonly PricedProduct[],
): { kind: 'empty' | 'error' | 'valid'; message: string } {
  if (session.cart.length === 0) {
    return { kind: 'empty', message: 'Add a product to begin.' };
  }

  try {
    subtotalCentimes(session.cart, products);
  } catch {
    return { kind: 'error', message: 'The order contains an invalid product or quantity.' };
  }

  if (session.serviceMode === 'Dine In' && session.table.trim() === '') {
    return { kind: 'error', message: 'Table is required for dine in.' };
  }

  return { kind: 'valid', message: 'Ready to check — nothing will be saved yet.' };
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

export function formatMoney(centimes: number): string {
  return moneyFormatter.format(centimes / 100);
}
