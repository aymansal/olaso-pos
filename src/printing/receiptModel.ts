export type ReceiptSnapshotForPrint = {
  receiptNumber: string;
  completedAt: number;
  cashierName?: string;
  serviceType: 'dine-in' | 'take-away' | 'order-online';
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    productName: string;
    receiptName?: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    sizeName?: string;
    modifiers: Array<{
      groupName?: string;
      optionName: string;
    }>;
    complimentary?: boolean;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
  receiptLanguage?: 'en' | 'fr';
  tenders?: Array<{
    paymentMethod?: 'Cash' | 'Card';
    dueCentimes: number;
    amountCentimes: number;
    changeCentimes: number;
  }>;
};

export type ReceiptModel = {
  receiptNumber: string;
  completedAt: number;
  cashierName?: string;
  serviceLabel: string;
  customerName?: string;
  tableLabel?: string;
  lines: Array<{
    name: string;
    quantity: number;
    unitPriceCentimes: number;
    lineTotalCentimes: number;
    sizeName?: string;
    modifiers: string[];
    complimentary?: boolean;
  }>;
  subtotalCentimes: number;
  discountCentimes: number;
  taxCentimes: number;
  totalCentimes: number;
  taxPolicyLabel: string;
  paymentMethod: string;
  receiptLanguage: 'en' | 'fr';
  paymentAmountCentimes?: number;
  changeCentimes?: number;
  tenders?: Array<{
    paymentMethod: 'Cash' | 'Card';
    dueCentimes: number;
    amountCentimes: number;
    changeCentimes: number;
  }>;
};

function text(value: unknown, label: string, maximum: number) {
  if (typeof value !== 'string') {
    throw new Error(`Receipt ${label} must be text.`);
  }
  const cleaned = value.trim().replace(/\s+/g, ' ');
  if (!cleaned || cleaned.length > maximum) {
    throw new Error(`Receipt ${label} must contain 1 to ${maximum} characters.`);
  }
  return cleaned;
}

function optionalText(value: unknown, label: string, maximum: number) {
  if (value === undefined || value === null || value === '') return undefined;
  return text(value, label, maximum);
}

function money(value: unknown, label: string) {
  if (!Number.isSafeInteger(value) || Number(value) < 0) {
    throw new Error(`Receipt ${label} must be non-negative integer centimes.`);
  }
  return Number(value);
}

function quantity(value: unknown) {
  if (!Number.isSafeInteger(value) || Number(value) < 1 || Number(value) > 100) {
    throw new Error('Receipt quantity must be an integer from 1 to 100.');
  }
  return Number(value);
}

export function createReceiptModel(
  snapshot: ReceiptSnapshotForPrint,
  payment?: {
    amountCentimes: number;
    changeCentimes?: number;
  },
): ReceiptModel {
  const receiptNumber = text(snapshot.receiptNumber, 'number', 64);
  if (!Number.isSafeInteger(snapshot.completedAt) || snapshot.completedAt < 0) {
    throw new Error('Receipt completion time is invalid.');
  }
  if (!Array.isArray(snapshot.lines)
      || snapshot.lines.length < 1
      || snapshot.lines.length > 50) {
    throw new Error('Receipt must contain 1 to 50 lines.');
  }

  const lines = snapshot.lines.map((line) => {
    const lineQuantity = quantity(line.quantity);
    const unitPriceCentimes = money(line.unitPriceCentimes, 'unit price');
    const lineTotalCentimes = money(line.lineTotalCentimes, 'line total');
    if (lineTotalCentimes !== unitPriceCentimes * lineQuantity) {
      throw new Error('Receipt line total does not match quantity and unit price.');
    }
    if (!Array.isArray(line.modifiers) || line.modifiers.length > 20) {
      throw new Error('Receipt line has too many modifiers.');
    }
    return {
      name: text(line.receiptName ?? line.productName, 'product name', 120),
      quantity: lineQuantity,
      unitPriceCentimes,
      lineTotalCentimes,
      ...(typeof line.sizeName === 'string' && line.sizeName.trim()
        ? { sizeName: text(line.sizeName.trim(), 'size', 80) }
        : {}),
      modifiers: line.modifiers.map((modifier) =>
        text(modifier.optionName, 'modifier', 80)),
      ...(line.complimentary === true ? { complimentary: true } : {}),
    };
  });

  const subtotalCentimes = money(snapshot.subtotalCentimes, 'subtotal');
  const discountCentimes = money(snapshot.discountCentimes, 'discount');
  const taxCentimes = money(snapshot.taxCentimes, 'tax');
  const totalCentimes = money(snapshot.totalCentimes, 'total');
  const lineSubtotal = lines.reduce(
    (sum, line) => sum + line.lineTotalCentimes,
    0,
  );
  if (lineSubtotal !== subtotalCentimes) {
    throw new Error('Receipt subtotal does not match its lines.');
  }
  if (subtotalCentimes - discountCentimes + taxCentimes !== totalCentimes) {
    throw new Error('Receipt total does not reconcile.');
  }

  const paymentAmountCentimes = payment
    ? money(payment.amountCentimes, 'payment amount')
    : undefined;
  const changeCentimes = paymentAmountCentimes === undefined
    ? undefined
    : paymentAmountCentimes - totalCentimes;
  if (changeCentimes !== undefined && changeCentimes < 0) {
    throw new Error('Receipt payment amount is less than the total.');
  }
  if (
    payment?.changeCentimes !== undefined
    && money(payment.changeCentimes, 'change') !== changeCentimes
  ) {
    throw new Error('Receipt change does not match payment and total.');
  }

  const tenders = snapshot.tenders;
  let modelTenders: ReceiptModel['tenders'];
  if (tenders !== undefined) {
    if (!Array.isArray(tenders) || tenders.length < 1 || tenders.length > 20) {
      throw new Error('Receipt must contain 1 to 20 payments.');
    }
    let dueSum = 0;
    modelTenders = tenders.map((tender) => {
      const dueCentimes = money(tender.dueCentimes, 'payment due');
      const amountCentimes = money(tender.amountCentimes, 'payment amount');
      const tenderChange = money(tender.changeCentimes, 'change');
      if (amountCentimes < dueCentimes) {
        throw new Error('Receipt payment amount is less than its due.');
      }
      if (tenderChange !== amountCentimes - dueCentimes) {
        throw new Error('Receipt change does not match amount and due.');
      }
      dueSum += dueCentimes;
      return {
        paymentMethod: tender.paymentMethod === 'Card'
          ? 'Card'
          : snapshot.paymentMethod === 'Card' ? 'Card' : 'Cash',
        dueCentimes,
        amountCentimes,
        changeCentimes: tenderChange,
      };
    });
    if (dueSum !== totalCentimes) {
      throw new Error('Receipt payments do not add up to the total.');
    }
  }

  const tableLabel = optionalText(snapshot.tableLabel, 'table', 40);
  const cashierName = optionalText(snapshot.cashierName, 'cashier', 80);
  const customerName = optionalText(snapshot.customerName, 'customer', 80);
  const receiptLanguage = snapshot.receiptLanguage ?? 'en';
  if (receiptLanguage !== 'en' && receiptLanguage !== 'fr') {
    throw new Error('Receipt language is invalid.');
  }
  const serviceLabel = snapshot.serviceType === 'dine-in'
    ? receiptLanguage === 'fr'
      ? `Sur place${tableLabel ? ` / Table ${tableLabel}` : ''}`
      : `Dine in${tableLabel ? ` / Table ${tableLabel}` : ''}`
    : snapshot.serviceType === 'take-away'
      ? receiptLanguage === 'fr' ? 'À emporter' : 'Take away'
      : snapshot.serviceType === 'order-online'
        ? receiptLanguage === 'fr' ? 'Commande en ligne' : 'Order online'
        : (() => { throw new Error('Receipt service type is invalid.'); })();

  return {
    receiptNumber,
    completedAt: snapshot.completedAt,
    ...(cashierName ? { cashierName } : {}),
    serviceLabel,
    ...(customerName ? { customerName } : {}),
    ...(tableLabel ? { tableLabel } : {}),
    lines,
    subtotalCentimes,
    discountCentimes,
    taxCentimes,
    totalCentimes,
    taxPolicyLabel: text(snapshot.taxPolicyLabel, 'tax policy', 120),
    paymentMethod: text(snapshot.paymentMethod, 'payment method', 80),
    receiptLanguage,
    ...(paymentAmountCentimes === undefined ? {} : { paymentAmountCentimes }),
    ...(changeCentimes === undefined ? {} : { changeCentimes }),
    ...(modelTenders === undefined ? {} : { tenders: modelTenders }),
  };
}
