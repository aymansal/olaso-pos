import assert from 'node:assert/strict';
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
} from '../src/features/pos/posSession.ts';

const products = [
  { id: 'americano', categoryId: 'coffee', name: 'Americano', priceCentimes: 1300 },
  { id: 'latte', categoryId: 'coffee', name: 'Latte', priceCentimes: 1800 },
  { id: 'tea', categoryId: 'tea', name: 'Mint Tea', priceCentimes: 1500 },
];

assert.deepEqual(
  filterProducts(products, 'coffee', '  AMER  ').map(({ id }) => id),
  ['americano'],
);
assert.deepEqual(filterProducts(products, 'snack', ''), []);

const baseSession = {
  query: '',
  selectedCategoryId: 'coffee',
  cart: [],
  serviceMode: 'Dine In',
  customerName: '',
  table: '',
  checkoutStatus: 'idle',
};
assert.equal(validatePosSession(baseSession, products).kind, 'empty');
assert.equal(
  validatePosSession({ ...baseSession, cart: addProduct([], 'latte') }, products).kind,
  'error',
);
assert.equal(
  validatePosSession({
    ...baseSession,
    cart: addProduct([], 'latte'),
    table: 'T4',
  }, products).kind,
  'valid',
);
assert.equal(
  validatePosSession({
    ...baseSession,
    cart: addProduct([], 'latte'),
    serviceMode: 'Take Away',
  }, products).kind,
  'valid',
);

let cart = [];
cart = addProduct(cart, 'americano');
cart = addProduct(cart, 'americano');
cart = incrementCartLine(cart, 'latte');
assert.deepEqual(cart, [
  {
    id: '["americano",[]]',
    productId: 'americano',
    quantity: 2,
    modifierOptionIds: [],
  },
]);

cart = addProduct(cart, 'latte');
cart = incrementCartLine(cart, '["latte",[]]');
assert.equal(subtotalCentimes(cart, products), 6200);
assert.equal(taxCentimes(6200), 0);
assert.equal(taxCentimes(105, 1000), 11);
assert.equal(totalCentimes(6200, 0), 6200);

cart = decrementCartLine(cart, '["americano",[]]');
cart = decrementCartLine(cart, '["americano",[]]');
assert.deepEqual(cart, [
  {
    id: '["americano",[]]',
    productId: 'americano',
    quantity: 1,
    modifierOptionIds: [],
  },
  {
    id: '["latte",[]]',
    productId: 'latte',
    quantity: 2,
    modifierOptionIds: [],
  },
]);
cart = removeCartLine(cart, '["latte",[]]');
assert.equal(cart.length, 1);
assert.deepEqual(removeCartLine(cart, '["americano",[]]'), []);
assert.throws(
  () => subtotalCentimes(addProduct([], 'missing'), products),
  /Invalid cart line/,
);
assert.equal(
  subtotalCentimes(
    addProduct([], 'latte', ['oat']),
    products,
    [{ id: 'oat', priceDeltaCentimes: 400 }],
  ),
  2200,
);

console.log('POS cart and money checks passed.');
