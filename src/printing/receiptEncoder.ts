import type { ReceiptModel } from './receiptModel';

const WIDTH = 48;
const ITEM_WIDTH = 30;
const QUANTITY_WIDTH = 5;
const MONEY_WIDTH = 13;
const ESC = 0x1b;
const FS = 0x1c;
const GS = 0x1d;
const CP858_HIGH = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ';
const CP858 = new Map(
  [...CP858_HIGH].map((character, index) => [character, index + 0x80]),
);

type ReceiptRow = {
  text: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  doubleWidth?: boolean;
};

function clean(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function encodeCp858(value: string) {
  const bytes: number[] = [];
  for (const character of value.normalize('NFC')) {
    const code = character.codePointAt(0) ?? 0x3f;
    if (code >= 0x20 && code <= 0x7e) bytes.push(code);
    else if (character === '\n') bytes.push(0x0a);
    else bytes.push(CP858.get(character) ?? 0x3f);
  }
  return Uint8Array.from(bytes);
}

export function formatReceiptMoney(centimes: number) {
  return `${Math.floor(centimes / 100)}.${String(centimes % 100).padStart(2, '0')}`;
}

function formatReceiptDate(timestamp: number) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Casablanca',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(timestamp);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('day')}/${value('month')}/${value('year')} ${value('hour')}:${value('minute')}`;
}

function columns(left: string, right: string, width = WIDTH) {
  const gap = width - left.length - right.length;
  if (gap < 1) return undefined;
  return `${left}${' '.repeat(gap)}${right}`;
}

function wrap(value: string, width: number) {
  const words = clean(value).split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    let remaining = word;
    while (remaining.length > width) {
      if (current) {
        lines.push(current);
        current = '';
      }
      lines.push(remaining.slice(0, width));
      remaining = remaining.slice(width);
    }
    if (!remaining) continue;
    const candidate = current ? `${current} ${remaining}` : remaining;
    if (candidate.length > width) {
      lines.push(current);
      current = remaining;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function itemRows(model: ReceiptModel): ReceiptRow[] {
  const labels = model.receiptLanguage === 'fr'
    ? { item: 'ARTICLE', quantity: 'QTÉ', payment: 'Paiement', subtotal: 'Sous-total', discount: 'Offert', tax: 'Sans taxe', total: 'TOTAL', change: 'Monnaie', order: 'COMMANDE', cashier: 'Caissier', customer: 'Client', thanks: 'MERCI.' }
    : { item: 'ITEM', quantity: 'QTY', payment: 'Payment', subtotal: 'Subtotal', discount: 'Offert', tax: 'No tax', total: 'TOTAL', change: 'Change', order: 'ORDER', cashier: 'Cashier', customer: 'Customer', thanks: 'THANK YOU.' };
  const rows: ReceiptRow[] = [{
    text: `${labels.item.padEnd(ITEM_WIDTH)}${labels.quantity.padEnd(QUANTITY_WIDTH)}${'MAD'.padStart(MONEY_WIDTH)}`,
    bold: true,
  }];
  for (const line of model.lines) {
    const names = wrap(line.name, ITEM_WIDTH);
    names.forEach((name, index) => {
      const quantity = index ? '' : ` ${line.quantity}`.padEnd(QUANTITY_WIDTH);
      const money = index
        ? ''
        : formatReceiptMoney(line.complimentary ? 0 : line.lineTotalCentimes);
      rows.push({
        text: `${name.padEnd(ITEM_WIDTH)}${quantity}${money.padStart(MONEY_WIDTH)}`,
      });
    });
    for (const modifier of line.modifiers) {
      for (const modifierLine of wrap(`+ ${modifier}`, ITEM_WIDTH)) {
        rows.push({ text: modifierLine });
      }
    }
  }
  return rows;
}

function detailRows(label: string, value: string): ReceiptRow[] {
  const row = columns(label, value);
  return row ? [{ text: row }] : wrap(`${label}: ${value}`, WIDTH).map((text) => ({ text }));
}

function receiptRows(model: ReceiptModel): ReceiptRow[] {
  const labels = model.receiptLanguage === 'fr'
    ? { payment: 'Paiement', subtotal: 'Sous-total', discount: 'Offert', tax: 'Sans taxe', total: 'TOTAL', change: 'Monnaie', order: 'COMMANDE', cashier: 'Caissier', customer: 'Client', thanks: 'MERCI.' }
    : { payment: 'Payment', subtotal: 'Subtotal', discount: 'Offert', tax: 'No tax', total: 'TOTAL', change: 'Change', order: 'ORDER', cashier: 'Cashier', customer: 'Customer', thanks: 'THANK YOU.' };
  const date = formatReceiptDate(model.completedAt);
  const order = `${labels.order} ${model.receiptNumber}`;
  const orderRow = columns(order, date);
  const meta: ReceiptRow[] = orderRow
    ? [{ text: orderRow, bold: true }]
    : [
        ...wrap(order, WIDTH).map((text) => ({ text, bold: true })),
        { text: date, align: 'right' },
      ];
  const cashier = model.cashierName ? `${labels.cashier}: ${model.cashierName}` : '';
  const contextRow = cashier ? columns(cashier, model.serviceLabel) : undefined;
  if (contextRow) meta.push({ text: contextRow });
  else {
    if (cashier) meta.push(...wrap(cashier, WIDTH).map((text) => ({ text })));
    meta.push(...wrap(model.serviceLabel, WIDTH).map((text) => ({ text })));
  }
  if (model.customerName) {
    meta.push(...wrap(`${labels.customer}: ${model.customerName}`, WIDTH).map((text) => ({ text })));
  }

  const payment = model.tenders?.length
    ? model.tenders.flatMap((tender) => [
        ...detailRows(model.paymentMethod, formatReceiptMoney(tender.amountCentimes)),
        ...detailRows(labels.change, formatReceiptMoney(tender.changeCentimes)),
      ])
    : [
        ...(model.paymentAmountCentimes === undefined
          ? detailRows(labels.payment, model.paymentMethod)
          : detailRows(model.paymentMethod, formatReceiptMoney(model.paymentAmountCentimes))),
        ...(model.changeCentimes === undefined
          ? []
          : detailRows(labels.change, formatReceiptMoney(model.changeCentimes))),
      ];

  return [
    { text: '-'.repeat(WIDTH) },
    ...meta,
    { text: '-'.repeat(WIDTH) },
    ...itemRows(model),
    { text: '-'.repeat(WIDTH) },
    ...detailRows(labels.subtotal, formatReceiptMoney(model.subtotalCentimes)),
    ...(model.discountCentimes
      ? detailRows(labels.discount, `-${formatReceiptMoney(model.discountCentimes)}`)
      : []),
    ...detailRows(labels.tax, formatReceiptMoney(model.taxCentimes)),
    {
      text: columns(labels.total, formatReceiptMoney(model.totalCentimes), WIDTH / 2) ?? labels.total,
      bold: true,
      doubleWidth: true,
    },
    ...payment,
    { text: '-'.repeat(WIDTH) },
    { text: labels.thanks, align: 'center', bold: true, doubleWidth: true },
    { text: model.receiptLanguage === 'fr' ? 'À bientôt' : 'See you soon', align: 'center' },
  ];
}

export function renderReceiptText(model: ReceiptModel) {
  return receiptRows(model).map((row) => row.text).join('\n') + '\n';
}

export function encodeWd8260Receipt(model: ReceiptModel) {
  const bytes: number[] = [
    ESC, 0x40,
    ESC, 0x74, 0x13,
    ESC, 0x61, 0x01,
    FS, 0x70, 0x01, 0x00,
    0x0a,
  ];
  for (const row of receiptRows(model)) {
    bytes.push(
      ESC, 0x61, row.align === 'center' ? 1 : row.align === 'right' ? 2 : 0,
      ESC, 0x45, row.bold ? 1 : 0,
      GS, 0x21, row.doubleWidth ? 0x10 : 0,
      ...encodeCp858(row.text),
      0x0a,
    );
  }
  bytes.push(
    ESC, 0x45, 0x00,
    GS, 0x21, 0x00,
    ESC, 0x61, 0x00,
    0x0a, 0x0a,
    GS, 0x56, 0x42, 0x00,
  );
  return Uint8Array.from(bytes);
}
