import type { CategoryId } from './data/categories';

export type ServiceMode = 'Dine In' | 'Take Away';
export type PaymentMethod = 'Cash' | 'Card';

export type CartLine = {
  id: string;
  productId: string;
  sizeId: string;
  quantity: number;
  choiceValueIds: string[];
};

export type PosSession = {
  query: string;
  selectedCategoryId: CategoryId;
  cart: CartLine[];
  serviceMode: ServiceMode;
  paymentMethod: PaymentMethod;
  checkoutStatus: 'idle' | 'processing' | 'success';
};

type PricedSize = {
  id: string;
  priceCentimes: number;
};

type PricedChoiceValue = {
  id: string;
  priceDeltaCentimes: number;
  /** When set, matches only that cart line size. */
  sizeId?: string;
};

type FilterableProduct = {
  categoryId: CategoryId;
  name: string;
};

export function createInitialPosSession(): PosSession {
  return {
    query: '',
    selectedCategoryId: 'coffee',
    cart: [],
    serviceMode: 'Dine In',
    paymentMethod: 'Cash',
    checkoutStatus: 'idle',
  };
}

export function hasUnfinishedCart(session: Pick<PosSession, 'cart'>) {
  return session.cart.length > 0;
}

export function addProduct(
  cart: CartLine[],
  productId: string,
  sizeId: string,
  choiceValueIds: string[] = [],
): CartLine[] {
  const normalizedChoices = [...new Set(choiceValueIds)].sort();
  const id = JSON.stringify([productId, sizeId, normalizedChoices]);
  const existing = cart.find((line) => line.id === id);

  return existing
    ? cart.map((line) => line === existing ? { ...line, quantity: line.quantity + 1 } : line)
    : [
        ...cart,
        {
          id,
          productId,
          sizeId,
          quantity: 1,
          choiceValueIds: normalizedChoices,
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
  sizes: readonly PricedSize[],
  choiceValues: readonly PricedChoiceValue[] = [],
): number {
  const sizePrices = new Map(sizes.map((size) => [size.id, size.priceCentimes]));

  return cart.reduce((subtotal, line) => {
    const sizePrice = sizePrices.get(line.sizeId);
    const choicePrice = line.choiceValueIds.reduce((sum, valueId) => {
      const sized = choiceValues.find(
        (value) => value.id === valueId && value.sizeId === line.sizeId,
      );
      const plain = choiceValues.find(
        (value) => value.id === valueId && value.sizeId === undefined,
      );
      const price = sized?.priceDeltaCentimes ?? plain?.priceDeltaCentimes;
      if (price === undefined) throw new Error(`Invalid choice: ${valueId}`);
      return sum + price;
    }, 0);

    if (
      sizePrice === undefined
      || !Number.isInteger(line.quantity)
      || line.quantity < 1
      || sizePrice + choicePrice < 0
    ) {
      throw new Error(`Invalid cart line: ${line.productId}`);
    }

    return subtotal + (sizePrice + choicePrice) * line.quantity;
  }, 0);
}

export function validatePosSession(
  session: PosSession,
  sizes: readonly PricedSize[],
  choiceValues: readonly PricedChoiceValue[] = [],
): { kind: 'empty' | 'error' | 'valid'; message: string } {
  if (session.cart.length === 0) {
    return { kind: 'empty', message: 'Add a product to begin.' };
  }

  try {
    subtotalCentimes(session.cart, sizes, choiceValues);
  } catch {
    return { kind: 'error', message: 'The order contains an invalid product or quantity.' };
  }

  return { kind: 'valid', message: 'Ready to place the order.' };
}

export function taxCentimes(subtotal: number): number {
  if (!Number.isSafeInteger(subtotal) || subtotal < 0) {
    throw new Error('Subtotal must be a non-negative integer centimes value.');
  }
  return 0;
}

export function totalCentimes(subtotal: number, tax: number): number {
  return subtotal + tax;
}
