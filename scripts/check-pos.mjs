import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { balanceOptionGroups } from '../src/features/pos/balanceOptionGroups.ts';
import {
  addProduct,
  chargedCentimes,
  changeCentimes,
  complimentaryCentimes,
  decrementCartLine,
  filterProducts,
  incrementCartLine,
  moveCartUnit,
  paidUnitCount,
  parseDirhamsToCentimes,
  payableCart,
  QUICK_TENDER_CENTIMES,
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
assert.match(rail, /aria-label=\{t\('Clear cart'\)\}/);
assert.match(rail, /<h2 className=\{styles\.title\}>\{t\('Current order'\)\}<\/h2>/);
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
assert.match(action, /onClick=\{\(\) => void commit\(\)\}/);
assert.match(action, /committing.current = true/);
assert.match(action, /disabled=\{locked \|\| !canSplit\}/);
assert.doesNotMatch(action, /role="slider"/);
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
assert.match(productCardCss, /object-fit: contain/);
assert.match(productCardCss, /width: 146px/);
assert.match(productCardCss, /height: 100px/);
assert.match(readFileSync('src/features/pos/components/OrderItemCard/OrderItemCard.module.css', 'utf8'), /object-fit: contain/);

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

assert.equal(parseDirhamsToCentimes('20'), 2000);
assert.equal(parseDirhamsToCentimes('20,50'), 2050);
assert.equal(parseDirhamsToCentimes('100.00'), 10000);
assert.equal(parseDirhamsToCentimes('20.123'), undefined);
assert.equal(parseDirhamsToCentimes('abc'), undefined);
assert.equal(changeCentimes(8000, 10000), 2000);
assert.equal(changeCentimes(8000, 7000), undefined);
assert.deepEqual([...QUICK_TENDER_CENTIMES], [2000, 5000, 10000, 20000]);

let splitCart = addProduct([], 'americano', 'americano-reg');
splitCart = addProduct(splitCart, 'americano', 'americano-reg');
const moved = moveCartUnit(splitCart, [], splitCart[0].id);
assert.equal(moved.from[0].quantity, 1);
assert.equal(moved.to[0].quantity, 1);
assert.equal(chargedCentimes(moved.to, sizes), 1300);

let mixed = addProduct([], 'americano', 'americano-reg');
mixed = addProduct(mixed, 'latte', 'latte-reg');
mixed = toggleCartLineOffert(mixed, mixed[0].id);
assert.equal(paidUnitCount(mixed), 1);
assert.equal(payableCart(mixed).length, 1);
assert.equal(chargedCentimes(mixed, sizes), 1800);

const paymentDialog = readFileSync(
  'src/features/pos/components/PaymentDialog/PaymentDialog.tsx',
  'utf8',
);
assert.match(paymentDialog, /QUICK_TENDER_CENTIMES/);
assert.match(paymentDialog, /payableCart/);
assert.match(paymentDialog, /canSplit/);
assert.match(paymentDialog, /Split/);
assert.match(paymentDialog, /locked \|\| processing \? null/);
assert.doesNotMatch(paymentDialog, /onClose=\{onCancel\}/);
// Only the receipt rail chooses split mode; no redundant in-dialog toggle.
assert.match(paymentDialog, /const split = canSplit && startSplit === true/);
assert.doesNotMatch(paymentDialog, /toggleSplit|styles\.split|setSplitFade/);
const posScreen = readFileSync('src/features/pos/PosScreen.tsx', 'utf8');
assert.match(posScreen, /PaymentDialog/);
assert.match(posScreen, /total === 0/);
assert.match(posScreen, /setPaying\(true\)/);
assert.match(posScreen, /paidUnitCount/);
assert.match(posScreen, /tenders/);
assert.match(posScreen, /const savedTenders = tenders \?\? \(total > 0 \? \[\{/);
assert.match(posScreen, /paymentMethod: session\.paymentMethod,[\s\S]*dueCentimes: total,[\s\S]*amountCentimes: total,[\s\S]*changeCentimes: 0/);
assert.doesNotMatch(posScreen, /ReceiptPreviewDialog|setReceiptPreview/);
// Card "No, one payment" must process the sale immediately, not open the
// single-tender dialog again.
assert.match(
  posScreen,
  /session.paymentMethod === 'Card'\) \{\s*await confirmPayment\(\);/,
);
const categoryCardCss = readFileSync(
  'src/features/pos/components/CategoryCard/CategoryCard.module.css',
  'utf8',
);
assert.match(categoryCardCss, /\.name \{[\s\S]*max-width: 105px/);
assert.match(categoryCardCss, /\.illustration \{[\s\S]*opacity: 0\.46/);
const productGridCss = readFileSync(
  'src/features/pos/components/ProductGrid/ProductGrid.module.css',
  'utf8',
);
assert.match(productGridCss, /overflow-y: auto/);
assert.doesNotMatch(productGridCss, /nth-child/);

const card = readFileSync(
  'src/features/pos/components/OrderItemCard/OrderItemCard.tsx',
  'utf8',
);
assert.match(card, /t\('Mark \{name\} Offert'/);
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
const railCss = readFileSync(
  'src/features/pos/components/ReceiptRail/ReceiptRail.module.css',
  'utf8',
);
assert.match(railCss, /height: 348px/);
assert.match(railCss, /\[data-offert\]/);
const paymentCss = readFileSync(
  'src/features/pos/components/PaymentDialog/PaymentDialog.module.css',
  'utf8',
);
assert.match(paymentCss, /\.sharePrice \{[\s\S]*right: 0/);
assert.match(paymentCss, /width: 88px/);

// Exercise the real dialog handler without mounting a browser or making a sale.
const choiceDialog = readFileSync(
  'src/features/pos/components/ModifierSelectionDialog/ModifierSelectionDialog.tsx', 'utf8',
);
const toggleSource = choiceDialog.slice(
  choiceDialog.indexOf('  function toggle('), choiceDialog.indexOf('\n  const groups ='),
);
assert(toggleSource.includes('function toggle('));
const toggleChoice = new Function('section', 'valueId', 'selected',
  `const setSelected = (update) => { selected = update(selected); };
    ${stripTypeScriptTypes(toggleSource)}\n toggle(section, valueId); return selected;`);
const optionalExtra = { required: false, min: 0, max: 1, values: [{ id: 'croissant' }, { id: 'other' }] };
assert.deepEqual(toggleChoice(optionalExtra, 'croissant', []), ['croissant']);
assert.deepEqual(toggleChoice(optionalExtra, 'croissant', ['croissant']), []);
assert.deepEqual(toggleChoice(optionalExtra, 'other', ['croissant']), ['other']);
assert.deepEqual(toggleChoice({ ...optionalExtra, required: true, min: 1 }, 'croissant', ['croissant']), ['croissant']);
assert.match(choiceDialog, /section\.max === 1 && \(section\.required \|\| section\.min > 0\)/);
console.log('POS cart, money, and optional-extra selection checks passed.');
assert.deepEqual(balanceOptionGroups([2]), [[0]]);
assert.deepEqual(balanceOptionGroups([2, 5, 2]), [[0, 2], [1]]);
assert.deepEqual(balanceOptionGroups([4, 5, 2]), [[0, 2], [1]]);
assert.deepEqual(balanceOptionGroups([2, 5, 7, 4]), [[0, 2], [1, 3]]);
assert.doesNotMatch(posScreen, /SplitOrderQuestion|setSplitQuestion/);
assert.match(posScreen, /checkoutInFlight.current = true/);
assert.match(posScreen, /finally \{\s*checkoutInFlight.current = false/);
const placeStart = posScreen.indexOf('  async function placeOrder()');
const placeSource = posScreen.slice(placeStart, posScreen.indexOf('  async function confirmPayment', placeStart));
for (const [method,total,expected] of [['Card',5600,'save'],['Cash',5600,'amount'],['Cash',0,'save']]) {
  let route;
  const run = new Function('session','total','confirmPayment','setPaying', `
    const validation={kind:'valid'}, setCheckoutError=()=>{};
    ${stripTypeScriptTypes(placeSource)}
    return placeOrder();`);
  await run({paymentMethod:method},total,async()=>{route='save'},()=>{route='amount'});
  assert.equal(route,expected);
}
const confirmStart = posScreen.indexOf('  async function confirmPayment');
const confirmSource = posScreen.slice(confirmStart, posScreen.indexOf('\n  return (',confirmStart));
let commits=0, releaseCommit;
const confirm = new Function('completeOrder', `
  const validation={kind:'valid'}, checkoutInFlight={current:false}, total=5600;
  const session={cart:[],serviceMode:'Dine In',paymentMethod:'Card'}, receiptLanguage='en';
  const setCheckoutError=()=>{}, onSessionChange=()=>{}, setPaying=()=>{}, setPayingSplit=()=>{};
  const localServiceType=value=>value;
  ${stripTypeScriptTypes(confirmSource)}
  return confirmPayment;`)(()=>{commits++;return new Promise(resolve=>{releaseCommit=resolve})});
const firstCommit=confirm();await confirm();assert.equal(commits,1);releaseCommit();await firstCommit;
const retryCommit=confirm();assert.equal(commits,2);releaseCommit();await retryCommit;
// Exercise payment recording with both starting methods without touching live sales.
const paymentStart = paymentDialog.indexOf('  async function takePayment()');
const takePaymentSource = paymentDialog.slice(paymentStart, paymentDialog.indexOf('\n  return (', paymentStart));
for (const methods of [['Cash', 'Card'], ['Card', 'Cash'], ['Cash', 'Card', 'Card']]) {
  let recorded = [], confirmed;
  for (const [index, method] of methods.entries()) {
    const run = new Function('activeMethod', 'recorded', 'lastSplit', 'onConfirm', 'setRecorded', `
      const canPay=true, due=1300, received=activeMethod==='Cash'?2000:1300,
        change=received-due, processing=false, split=true;
      const setPick=()=>{}, resetCashAmount=()=>{};
      ${stripTypeScriptTypes(takePaymentSource)}
      return takePayment();`);
    await run(method, recorded, index===methods.length-1,
      async rows=>{confirmed=rows}, update=>{recorded=update(recorded)});
  }
  assert.deepEqual(confirmed.map(row=>row.paymentMethod),methods);
  assert.equal(confirmed.reduce((sum,row)=>sum+row.dueCentimes,0),1300*methods.length);
  assert(confirmed.every(row=>row.changeCentimes===(row.paymentMethod==='Cash'?700:0)));
}

// Shared lists must escape sibling/scroll stacking contexts and stay scrollable.
const menuSelect = readFileSync('src/components/MenuSelect/MenuSelect.tsx', 'utf8');
assert.match(menuSelect, /popover="auto"/);
assert.match(menuSelect, /showPopover\(\)/);
assert.match(menuSelect, /menu\.current\?\.contains\(event.target as Node\)/);
assert.match(menuSelect, /upwards/);
for (const [file, selector] of [
  ['src/features/stock/components/StockTable/StockTable.module.css', '.ingredient strong'],
  ['src/features/products/components/ProductList/ProductList.module.css', '.productCopy strong,'],
]) {
  const css = readFileSync(file, 'utf8');
  const rule = css.slice(css.indexOf(selector));
  assert.match(rule.slice(0, rule.indexOf('}') + 1), /line-height: 1\.4/);
}
