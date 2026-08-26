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

const sizes = [
  { id: 'americano-reg', priceCentimes: 1300 },
  { id: 'latte-reg', priceCentimes: 1800 },
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
  paymentMethod: 'Cash',
  checkoutStatus: 'idle',
};
assert.equal(validatePosSession(baseSession, sizes).kind, 'empty');
assert.equal(
  validatePosSession({
    ...baseSession,
    cart: addProduct([], 'latte', 'latte-reg'),
  }, sizes).kind,
  'valid',
);
assert.equal(
  validatePosSession({
    ...baseSession,
    cart: addProduct([], 'latte', 'latte-reg'),
    serviceMode: 'Take Away',
  }, sizes).kind,
  'valid',
);

let cart = [];
cart = addProduct(cart, 'americano', 'americano-reg');
cart = addProduct(cart, 'americano', 'americano-reg');
cart = incrementCartLine(cart, 'latte');
assert.deepEqual(cart, [
  {
    id: '["americano","americano-reg",[]]',
    productId: 'americano',
    sizeId: 'americano-reg',
    quantity: 2,
    choiceValueIds: [],
    modifierOptionIds: [],
  },
]);

cart = addProduct(cart, 'latte', 'latte-reg');
cart = incrementCartLine(cart, '["latte","latte-reg",[]]');
assert.equal(subtotalCentimes(cart, sizes), 6200);
assert.equal(taxCentimes(6200), 0);
assert.equal(taxCentimes(105), 0);
assert.equal(totalCentimes(6200, 0), 6200);

cart = decrementCartLine(cart, '["americano","americano-reg",[]]');
cart = decrementCartLine(cart, '["americano","americano-reg",[]]');
assert.deepEqual(cart, [
  {
    id: '["americano","americano-reg",[]]',
    productId: 'americano',
    sizeId: 'americano-reg',
    quantity: 1,
    choiceValueIds: [],
    modifierOptionIds: [],
  },
  {
    id: '["latte","latte-reg",[]]',
    productId: 'latte',
    sizeId: 'latte-reg',
    quantity: 2,
    choiceValueIds: [],
    modifierOptionIds: [],
  },
]);
cart = removeCartLine(cart, '["latte","latte-reg",[]]');
assert.equal(cart.length, 1);
assert.deepEqual(removeCartLine(cart, '["americano","americano-reg",[]]'), []);
assert.throws(
  () => subtotalCentimes(addProduct([], 'missing', 'missing-size'), sizes),
  /Invalid cart line/,
);
assert.equal(
  subtotalCentimes(
    addProduct([], 'latte', 'latte-reg', ['oat']),
    sizes,
    [{ id: 'oat', priceDeltaCentimes: 400 }],
  ),
  2200,
);
assert.deepEqual(
  addProduct([], 'latte', 'latte-large', ['oat', 'shot']),
  [{
    id: '["latte","latte-large",["oat","shot"]]',
    productId: 'latte',
    sizeId: 'latte-large',
    quantity: 1,
    choiceValueIds: ['oat', 'shot'],
    modifierOptionIds: [],
  }],
);

console.log('POS cart and money checks passed.');
