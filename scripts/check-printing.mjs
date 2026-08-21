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
const goldenSha256 = '8C8C109B9A4F884D44819A55099C7D88FA7B005927FD5BB4767734E79EF6B1AE';

const outputIndex = process.argv.indexOf('--output');
if (outputIndex >= 0) {
  const outputPath = process.argv[outputIndex + 1];
  if (!outputPath) throw new Error('--output requires a file path.');
  writeFileSync(resolve(outputPath), raw);
}
if (process.argv.includes('--print-text')) console.log(text);

assert.equal((text.match(/^-{48}$/gm) || []).length, 4);
assert.equal((text.match(/\bMAD\b/g) || []).length, 1);
assert.match(text, /ORDER 000123\s+21\/08\/2026 14:35/);
assert.match(text, /Cashier: Alex\s+Dine in \/ Table T4/);
assert.match(text, /Café crème double\s+2\s+36\.00/);
assert.match(text, /À bientôt \/ See you soon/);
assert.doesNotMatch(text, /example\.com|QR/i);
assert.deepEqual(
  [...raw.subarray(0, 10)],
  [0x1b, 0x40, 0x1b, 0x74, 0x13, 0x1b, 0x61, 0x01, 0x1c, 0x70],
);
assert.equal(Buffer.from(raw).indexOf(Buffer.from([0x1d, 0x76, 0x30, 0x00])), -1);
assert.equal(Buffer.from(raw).indexOf(Buffer.from([0x1d, 0x28, 0x6b])), -1);
assert.deepEqual([...raw.subarray(-4)], [0x1d, 0x56, 0x42, 0x00]);
assert.equal(
  createHash('sha256').update(raw).digest('hex').toUpperCase(),
  goldenSha256,
  'Application receipt bytes differ from the paper-approved golden stream',
);
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
  paymentMethod: 'Pending owner confirmation',
});
const edgeText = renderReceiptText(edge);
assert(edgeText.split('\n').every((row) => row.length <= 48));

console.log(JSON.stringify({
  bytes: raw.length,
  sha256: goldenSha256,
}));
console.log('WD8260 receipt model, wrapping, CP858, totals, and byte checks passed');
