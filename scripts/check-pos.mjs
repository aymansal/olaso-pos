import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  addProduct,
  complimentaryCentimes,
  decrementCartLine,
  filterProducts,
  incrementCartLine,
  removeCartLine,
  subtotalCentimes,
  taxCentimes,
  toggleCartLineOffert,
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
  },
  {
    id: '["latte","latte-reg",[]]',
    productId: 'latte',
    sizeId: 'latte-reg',
    quantity: 2,
    choiceValueIds: [],
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
  }],
);

const screen = readFileSync('src/features/pos/PosScreen.tsx', 'utf8');
assert.match(screen, /<QuickAddRow products=\{quickAddProducts\} onAdd=\{beginAdd\}/);
const header = readFileSync('src/features/pos/components/Header/Header.tsx', 'utf8');
assert.doesNotMatch(header, /Bell|badge/);
const rail = readFileSync('src/features/pos/components/ReceiptRail/ReceiptRail.tsx', 'utf8');
assert.doesNotMatch(rail, /ReceiptHeader|Purchase Receipt|Local draft|Order list|start the order/);
assert.match(rail, /aria-label="Clear cart"/);
assert.match(rail, /<h2 className=\{styles\.title\}>Current order<\/h2>/);
assert.match(rail, /disabled=\{lines\.length === 0 \|\| checkoutProcessing\}/);
assert.match(screen, /onClearCart=/);
const segmented = readFileSync(
  'src/features/pos/components/SegmentedControl/SegmentedControl.tsx',
  'utf8',
);
assert.match(segmented, /styles\.indicator/);
const payment = readFileSync(
  'src/features/pos/components/PaymentMethodControl/PaymentMethodControl.tsx',
  'utf8',
);
assert.match(payment, /styles\.indicator/);
const navigation = readFileSync(
  'src/features/pos/components/TopNavigation/TopNavigation.tsx',
  'utf8',
);
assert.match(navigation, /styles\.indicator/);

const action = readFileSync(
  'src/features/pos/components/PrimaryAction/PrimaryAction.tsx',
  'utf8',
);
assert.match(action, /Slide to place order/);
assert.doesNotMatch(action, /clickAction/);

const productCard = readFileSync(
  'src/features/pos/components/ProductCard/ProductCard.tsx',
  'utf8',
);
const productCardCss = readFileSync(
  'src/features/pos/components/ProductCard/ProductCard.module.css',
  'utf8',
);
assert.match(productCard, /<Plus /);
assert.doesNotMatch(productCard, /styles\.hit/);
assert.match(productCardCss, /text-overflow: ellipsis/);
assert.match(productCardCss, /width: 100px/);

let offered = addProduct([], 'latte', 'latte-reg');
offered = incrementCartLine(offered, offered[0].id);
offered = toggleCartLineOffert(offered, offered[0].id);
assert.equal(offered.length, 2);
assert.equal(offered.find((line) => line.complimentary)?.quantity, 1);
assert.equal(offered.find((line) => !line.complimentary)?.quantity, 1);
assert.equal(subtotalCentimes(offered, sizes), 3600);
assert.equal(complimentaryCentimes(offered, sizes), 1800);
offered = toggleCartLineOffert(
  offered,
  offered.find((line) => line.complimentary).id,
);
assert.equal(offered.length, 1);
assert.equal(offered[0].quantity, 2);
assert.equal(offered[0].complimentary, undefined);
assert.equal(complimentaryCentimes(offered, sizes), 0);

const card = readFileSync(
  'src/features/pos/components/OrderItemCard/OrderItemCard.tsx',
  'utf8',
);
assert.match(card, /Mark \$\{product.name\} Offert/);
assert.match(card, /onToggleOffert/);
const cardCss = readFileSync(
  'src/features/pos/components/OrderItemCard/OrderItemCard.module.css',
  'utf8',
);
assert.match(cardCss, /\.offert \{[\s\S]*right: 64px/);
assert.match(cardCss, /width: 36px/);
assert.doesNotMatch(cardCss, /\.offert \{[\s\S]*left: 8px/);
const summary = readFileSync(
  'src/features/pos/components/PaymentSummary/PaymentSummary.tsx',
  'utf8',
);
assert.match(summary, /Offert/);
assert.doesNotMatch(summary, /No tax/);
const summaryCss = readFileSync(
  'src/features/pos/components/PaymentSummary/PaymentSummary.module.css',
  'utf8',
);
assert.match(summaryCss, /justify-content: flex-end/);

console.log('POS cart and money checks passed.');
