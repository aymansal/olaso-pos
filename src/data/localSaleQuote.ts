import type { CartLine } from '../features/pos/posSession';
import { loadOperationalCache, type OperationalCacheSnapshot } from './operationalCache.ts';
import { prepareSale } from './localSales.ts';

export type LocalSaleQuote = { id: string; menu: OperationalCacheSnapshot };

// One App-owned payment can be open on a tablet. This lasts across a lock,
// like the existing cart; it does not claim process-death recovery.
let active: (LocalSaleQuote & { cartKey: string }) | undefined;

function cartKey(cart: CartLine[]) {
  return JSON.stringify(cart.map((line) => [line.productId, line.sizeId,
    [...line.choiceValueIds].sort(), line.quantity, line.complimentary === true]));
}

export async function createLocalSaleQuote(cart: CartLine[]): Promise<LocalSaleQuote> {
  const savedCart = structuredClone(cart);
  const menu = await loadOperationalCache();
  // Validate every selected configuration from SQLite before accepting payment.
  prepareSale(menu, { cart: savedCart, cashierProfileId: 'quote', cashierName: 'Quote',
    serviceType: 'dine-in', paymentMethod: 'Cash' }, 'quote');
  const id = crypto.randomUUID();
  active = { id, menu, cartKey: cartKey(savedCart) };
  return { id, menu: structuredClone(menu) };
}

export function readLocalSaleQuote(id: string, cart: CartLine[]) {
  if (!active || active.id !== id || active.cartKey !== cartKey(cart)) {
    throw new Error('The payment quote no longer matches this order.');
  }
  // Neither UI nor final-sale preparation may mutate the trusted quote.
  return structuredClone(active.menu);
}

export function releaseLocalSaleQuote(id: string) {
  if (active?.id === id) active = undefined;
}
