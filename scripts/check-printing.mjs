import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  encodeCp858,
  encodeWd8260Receipt,
  renderReceiptText,
} from '../src/printing/receiptEncoder.ts';
import { createReceiptModel } from '../src/printing/receiptModel.ts';
import { createSavedReceiptBytes } from '../src/printing/printReceipt.ts';
import { attemptSaleReceiptPrint } from '../src/data/receiptPrinting.ts';
import {
  encodeDailyOwnerReport,
  renderDailyOwnerReport,
} from '../src/printing/dailyReportEncoder.ts';

const snapshot = {
  receiptNumber: '000123',
  completedAt: Date.parse('2026-08-21T13:35:00.000Z'),
  cashierName: 'Alex',
  serviceType: 'dine-in',
  tableLabel: 'T4',
  lines: [
    line('Café crème double', 2, 1800),
    line('Croissant aux amandes', 1, 1850),
    line('Thé vert menthe', 1, 1500),
  ],
  subtotalCentimes: 6950,
  discountCentimes: 0,
  taxCentimes: 0,
  totalCentimes: 6950,
  taxPolicyLabel: 'Temporary 0% — owner confirmation pending',
  paymentMethod: 'Cash',
};

function line(productName, quantity, unitPriceCentimes, modifiers = []) {
  return {
    productName,
    receiptName: productName,
    quantity,
    unitPriceCentimes,
    lineTotalCentimes: quantity * unitPriceCentimes,
    modifiers: modifiers.map((optionName) => ({ optionName })),
  };
}

const model = createReceiptModel(snapshot, {
  amountCentimes: 10000,
  changeCentimes: 3050,
});
const text = renderReceiptText(model);
const raw = encodeWd8260Receipt(model);
const goldenSha256 = 'F84EAA57B4B930D76A3410B56FE6128A1B3D2DF3F33CC33078B2CFE8567B847A';

const outputIndex = process.argv.indexOf('--output');
if (outputIndex >= 0) {
  const outputPath = process.argv[outputIndex + 1];
  if (!outputPath) throw new Error('--output requires a file path.');
  writeFileSync(resolve(outputPath), raw);
}
if (process.argv.includes('--print-text')) console.log(text);

assert.equal((text.match(/^-{48}$/gm) || []).length, 5);
assert.equal((text.match(/\bMAD\b/g) || []).length, 1);
assert.match(text, /ORDER 000123\s+21\/08\/2026 14:35/);
assert.match(text, /Cashier: Alex\s+Dine in \/ Table T4/);
assert.match(text, /Café crème double\s+2\s+36\.00/);
assert.match(text, /THANK YOU\.\nSee you soon/);
assert.ok(text.indexOf('TOTAL') < text.indexOf('PAYMENT SUMMARY'));
assert.match(text, /CASH/);
assert.match(text, /Cash received\s+\+100\.00/);
assert.match(text, /Change given\s+-30\.50/);
assert.match(text, /= Cash payment\s+69\.50/);
assert.match(text, /TOTAL PAID\s+69\.50/);
assert.doesNotMatch(text, /No tax/);
assert.doesNotMatch(text, /Subtotal|Offert/);
const offertText = renderReceiptText(createReceiptModel({
  ...snapshot,
  discountCentimes: 1800,
  totalCentimes: 5150,
}, {
  amountCentimes: 5150,
  changeCentimes: 0,
}));
assert.match(offertText, /Subtotal\s+69\.50/);
assert.match(offertText, /Offert\s+-18\.00/);
assert.doesNotMatch(offertText, /No tax/);
const professionalOptionText = renderReceiptText(createReceiptModel({
  ...snapshot,
  serviceType: 'take-away',
  receiptLanguage: 'fr',
  lines: [{
    ...line('Latte', 1, 1800, ['Lait d’amande', 'Vanille', 'Extra shot']),
    sizeName: 'Regular',
    complimentary: true,
  }],
  subtotalCentimes: 1800,
  discountCentimes: 1800,
  totalCentimes: 0,
  paymentMethod: 'Card',
}));
assert.match(professionalOptionText, /Latte · Regular\s+1\s+0\.00/);
assert.match(professionalOptionText, /Lait d.amande · Vanille/);
assert.match(professionalOptionText, /Extra shot/);
assert.match(professionalOptionText, /À emporter/);
assert.equal((professionalOptionText.match(/Offert/g) ?? []).length, 1);
assert.doesNotMatch(professionalOptionText, /^\+ /m);
assert.doesNotMatch(text, /example\.com|QR/i);
assert.deepEqual(
  [...raw.subarray(0, 10)],
  [0x1b, 0x40, 0x1b, 0x74, 0x13, 0x1b, 0x61, 0x01, 0x1c, 0x70],
);
assert.equal(Buffer.from(raw).indexOf(Buffer.from([0x1d, 0x76, 0x30, 0x00])), -1);
assert.equal(Buffer.from(raw).indexOf(Buffer.from([0x1d, 0x28, 0x6b])), -1);
assert.deepEqual([...raw.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
const savedSaleSnapshot = {
  ...snapshot,
  paymentMethod: 'Card',
  receiptLanguage: 'fr',
};
const savedSaleBytes = createSavedReceiptBytes(savedSaleSnapshot);
assert.deepEqual(
  savedSaleBytes,
  encodeWd8260Receipt(createReceiptModel(savedSaleSnapshot)),
);
const savedSaleText = renderReceiptText(createReceiptModel(savedSaleSnapshot));
assert.match(savedSaleText, /Paiement carte\s+69\.50/);
assert.match(savedSaleText, /TOTAL RÉGLÉ\s+69\.50/);

const successfulOrder = [];
const successfulAttempt = await attemptSaleReceiptPrint(
  { localSaleId: 'sale-print-check', receipt: savedSaleSnapshot },
  {
    recordAttempt: async (localSaleId) => successfulOrder.push(`attempt:${localSaleId}`),
    loadSettings: async () => {
      successfulOrder.push('settings');
      return { printerHost: '192.0.2.10', printerPort: 9100 };
    },
    sendReceipt: async () => {
      successfulOrder.push('send');
      return {
        bytesWritten: savedSaleBytes.length,
        connectMs: 2,
        writeMs: 1,
        totalMs: 3,
        paperConfirmed: false,
      };
    },
    recordSuccess: async (localSaleId, result) =>
      successfulOrder.push(`success:${localSaleId}:${result.bytesWritten}`),
    recordFailure: async () => successfulOrder.push('unexpected-failure'),
  },
);
assert.equal(successfulAttempt.state, 'printed');
assert.deepEqual(successfulOrder, [
  'attempt:sale-print-check',
  'settings',
  'send',
  `success:sale-print-check:${savedSaleBytes.length}`,
]);

const failedOrder = [];
const failedAttempt = await attemptSaleReceiptPrint(
  { localSaleId: 'sale-failure-check', receipt: savedSaleSnapshot },
  {
    recordAttempt: async () => failedOrder.push('attempt'),
    loadSettings: async () => {
      failedOrder.push('settings');
      return { printerHost: '192.0.2.11', printerPort: 9100 };
    },
    sendReceipt: async () => {
      failedOrder.push('send');
      throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' });
    },
    recordSuccess: async () => failedOrder.push('unexpected-success'),
    recordFailure: async (_localSaleId, failure) =>
      failedOrder.push(`failure:${failure.code}`),
  },
);
assert.equal(failedAttempt.state, 'failed');
assert.match(failedAttempt.message, /Reprint remains available/);
assert.deepEqual(failedOrder, [
  'attempt',
  'settings',
  'send',
  'failure:TIMEOUT',
]);
assert.equal(
  createHash('sha256').update(raw).digest('hex').toUpperCase(),
  goldenSha256,
  'Application receipt bytes differ from the approved policy receipt stream',
);
const splitSnapshot = {
  ...snapshot,
  tenders: [
    { dueCentimes: 3600, amountCentimes: 5000, changeCentimes: 1400 },
    { dueCentimes: 3350, amountCentimes: 5000, changeCentimes: 1650 },
  ],
};
const splitText = renderReceiptText(createReceiptModel(splitSnapshot));
assert.match(splitText, /PAYMENT SUMMARY/);
assert.match(splitText, /PAYMENT 1 - CASH/);
assert.match(splitText, /PAYMENT 2 - CASH/);
assert.equal((splitText.match(/Cash received\s+\+50\.00/g) || []).length, 2);
assert.match(splitText, /Change given\s+-14\.00/);
assert.match(splitText, /Change given\s+-16\.50/);
assert.equal((splitText.match(/= Cash payment/g) || []).length, 2);
assert.match(splitText, /TOTAL PAID\s+69\.50/);
const splitBytes = createSavedReceiptBytes(splitSnapshot);
assert.equal(
  Buffer.from(splitBytes).subarray(0, 10).equals(Buffer.from(raw.subarray(0, 10))),
  true,
);
assert.deepEqual([...splitBytes.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
assert.match(
  renderReceiptText(createReceiptModel(JSON.parse(JSON.stringify(splitSnapshot)))),
  /Change given\s+-14\.00/,
);
const mixedText = renderReceiptText(createReceiptModel({
  ...snapshot,
  tenders: [
    { paymentMethod: 'Card', dueCentimes: 3600, amountCentimes: 3600, changeCentimes: 0 },
    { paymentMethod: 'Cash', dueCentimes: 3350, amountCentimes: 5000, changeCentimes: 1650 },
  ],
}));
assert.match(mixedText, /PAYMENT 1 - CARD/);
assert.match(mixedText, /Card payment\s+36\.00/);
assert.match(mixedText, /PAYMENT 2 - CASH/);
assert.equal((mixedText.match(/Cash received/g) ?? []).length, 1);
assert.equal((mixedText.match(/Change given/g) ?? []).length, 1);
assert.ok(mixedText.indexOf('PAYMENT 1 - CARD') < mixedText.indexOf('PAYMENT 2 - CASH'));
assert.ok(mixedText.indexOf('PAYMENT 2 - CASH') < mixedText.indexOf('Cash received'));
assert.ok(mixedText.indexOf('Cash received') < mixedText.indexOf('Change given'));
const cardSnapshotMixed = renderReceiptText(createReceiptModel({
  ...snapshot,
  paymentMethod: 'Card',
  tenders: [
    { paymentMethod: 'Cash', dueCentimes: 3350, amountCentimes: 5000, changeCentimes: 1650 },
    { paymentMethod: 'Card', dueCentimes: 3600, amountCentimes: 3600, changeCentimes: 0 },
  ],
}));
assert.match(cardSnapshotMixed, /PAYMENT 1 - CASH/);
assert.match(cardSnapshotMixed, /Cash received\s+\+50\.00/);
assert.match(cardSnapshotMixed, /Change given\s+-16\.50/);
assert.match(cardSnapshotMixed, /PAYMENT 2 - CARD/);
assert.match(cardSnapshotMixed, /Card payment\s+36\.00/);
assert.equal((cardSnapshotMixed.match(/Cash received/g) ?? []).length, 1);
assert.equal((cardSnapshotMixed.match(/Change given/g) ?? []).length, 1);

const cardOnlyText = renderReceiptText(createReceiptModel({
  ...snapshot,
  paymentMethod: 'Card',
  tenders: [{ paymentMethod: 'Card', dueCentimes: 6950, amountCentimes: 6950, changeCentimes: 0 }],
}));
assert.match(cardOnlyText, /CARD/);
assert.match(cardOnlyText, /Card payment\s+69\.50/);
assert.doesNotMatch(cardOnlyText, /Cash received|Change given/);

const exactCashText = renderReceiptText(createReceiptModel({
  ...snapshot,
  tenders: [{ paymentMethod: 'Cash', dueCentimes: 6950, amountCentimes: 6950, changeCentimes: 0 }],
}));
assert.match(exactCashText, /CASH/);
assert.match(exactCashText, /Cash payment\s+69\.50/);
assert.doesNotMatch(exactCashText, /Cash received|Change given/);

const dailyReport = {
  language: 'fr',
  businessDate: '2026-09-02',
  printedAt: Date.parse('2026-09-02T18:30:00.000Z'),
  ownerName: 'Olaso Owner',
  orderCount: 2,
  itemCount: 4,
  subtotalCentimes: 8500,
  offertCentimes: 1000,
  netCentimes: 7500,
  averageCentimes: 3750,
  paymentTotals: [
    { label: 'Card', totalCentimes: 4000, orderCount: 1 },
    { label: 'Cash', totalCentimes: 3500, orderCount: 2 },
  ],
  serviceTotals: [
    { service: 'dine-in', orderCount: 1 },
    { service: 'take-away', orderCount: 1 },
  ],
  cancellations: [{ receiptNumber: '000122', reason: 'Erreur caisse', actorName: 'Olaso Owner' }],
  products: [{ name: 'Latte · Regular', quantity: 3, totalCentimes: 5400 }],
  ingredientCostCentimes: 1800,
  grossProfitCentimes: 5700,
  compensationCentimes: 900,
  expenseCentimes: 300,
  operatingProfitCentimes: 4500,
  incompleteCostCount: 0,
  inventoryValueCentimes: 125000,
  lowStockCount: 2,
  pendingSyncCount: 1,
  failedPrintCount: 0,
};
const dailyText = renderDailyOwnerReport(dailyReport);
const dailyBytes = encodeDailyOwnerReport(dailyReport);
assert.match(dailyText, /RAPPORT QUOTIDIEN DU PROPRIÉTAIRE/);
assert.match(dailyText, /Carte \(1\)\s+40\.00 MAD/);
assert.match(dailyText, /Espèces \(2\)\s+35\.00 MAD/);
assert.match(dailyText, /À emporter\s+1/);
assert.match(dailyText, /Résultat opérationnel\s+45\.00 MAD/);
assert.doesNotMatch(dailyText, /Terminal|Comptoir/);
assert(dailyText.split('\n').every((row) => row.length <= 48));
assert.deepEqual([...dailyBytes.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
assert.deepEqual(
  [...encodeCp858('TÉTOUAN Café Thé À bientôt')],
  [84, 144, 84, 79, 85, 65, 78, 32, 67, 97, 102, 130, 32, 84, 104, 130, 32, 183, 32, 98, 105, 101, 110, 116, 147, 116],
);
assert.equal(Buffer.from(encodeCp858('مرحبا')).toString('ascii'), '?????');

assert.throws(
  () => createReceiptModel({ ...snapshot, receiptNumber: '' }),
  /number must contain/,
);
assert.throws(
  () => createReceiptModel({ ...snapshot, totalCentimes: 1 }),
  /does not reconcile/,
);
assert.throws(
  () => createReceiptModel(snapshot, { amountCentimes: 6000 }),
  /less than the total/,
);

const edge = createReceiptModel({
  ...snapshot,
  receiptNumber: 'X'.repeat(64),
  cashierName: undefined,
  customerName: 'Customer with a long but valid saved display name',
  tableLabel: undefined,
  serviceType: 'take-away',
  lines: [
    line(
      'Very long product name that must wrap deterministically across receipt lines',
      100,
      999999,
      ['Extra long modifier option that also wraps without changing totals'],
    ),
  ],
  subtotalCentimes: 99999900,
  totalCentimes: 99999900,
  paymentMethod: 'Cash',
});
const edgeText = renderReceiptText(edge);
assert(edgeText.split('\n').every((row) => row.length <= 48));

console.log(JSON.stringify({
  bytes: raw.length,
  sha256: goldenSha256,
}));
console.log('WD8260 receipt model, wrapping, CP858, totals, and byte checks passed');
