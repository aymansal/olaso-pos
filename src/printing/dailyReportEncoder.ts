import {
  encodeWd8260Rows,
  formatReceiptMoney,
  type PrinterRow,
} from './receiptEncoder.ts';

const WIDTH = 48;

export type DailyOwnerReport = {
  language: 'en' | 'fr';
  businessDate: string;
  printedAt: number;
  ownerName: string;
  terminalName: string;
  orderCount: number;
  itemCount: number;
  subtotalCentimes: number;
  offertCentimes: number;
  netCentimes: number;
  averageCentimes: number;
  paymentTotals: Array<{ label: string; totalCentimes: number; orderCount: number }>;
  serviceTotals: Array<{ service: 'dine-in' | 'take-away' | 'online'; orderCount: number }>;
  cancellations: Array<{ receiptNumber: string; reason: string; actorName: string }>;
  products: Array<{ name: string; quantity: number; totalCentimes: number }>;
  ingredientCostCentimes: number;
  grossProfitCentimes: number;
  compensationCentimes: number;
  expenseCentimes: number;
  operatingProfitCentimes: number;
  incompleteCostCount: number;
  inventoryValueCentimes: number;
  lowStockCount: number;
  pendingSyncCount: number;
  failedPrintCount: number;
};

function clean(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function wrap(value: string, width = WIDTH) {
  const words = clean(value).split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= width) line = next;
    else {
      if (line) lines.push(line);
      line = word.slice(0, width);
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function pair(label: string, value: string): PrinterRow[] {
  const gap = WIDTH - label.length - value.length;
  return gap > 0
    ? [{ text: `${label}${' '.repeat(gap)}${value}` }]
    : wrap(`${label}: ${value}`).map((text) => ({ text }));
}

function section(title: string): PrinterRow[] {
  return [{ text: '-'.repeat(WIDTH) }, { text: title, bold: true }];
}

function money(value: number) {
  return `${formatReceiptMoney(value)} MAD`;
}

function reportRows(report: DailyOwnerReport): PrinterRow[] {
  const fr = report.language === 'fr';
  const l = fr ? {
    title: 'RAPPORT QUOTIDIEN DU PROPRIÉTAIRE', date: 'Date', printed: 'Imprimé', owner: 'Propriétaire', terminal: 'Terminal',
    sales: 'VENTES', orders: 'Commandes', items: 'Articles', subtotal: 'Sous-total', offert: 'Offert', net: 'Ventes nettes', average: 'Panier moyen',
    payments: 'PAIEMENTS', cash: 'Espèces', card: 'Carte', services: 'SERVICE', dineIn: 'Sur place', takeAway: 'À emporter', online: 'En ligne',
    cancellations: 'ANNULATIONS', none: 'Aucune', by: 'Par', products: 'PRODUITS',
    profit: 'RÉSULTAT', ingredients: 'Coût ingrédients', gross: 'Marge brute', wages: 'Salaires', expenses: 'Autres dépenses', operating: 'Résultat opérationnel', incomplete: 'Coûts incomplets',
    controls: 'STOCK ET CONTRÔLES', stockValue: 'Valeur du stock', lowStock: 'Stock faible', unsynced: 'Non synchronisé', printFailures: 'Échecs impression', end: 'FIN DU RAPPORT',
  } : {
    title: 'OWNER DAILY REPORT', date: 'Date', printed: 'Printed', owner: 'Owner', terminal: 'Terminal',
    sales: 'SALES', orders: 'Orders', items: 'Items', subtotal: 'Subtotal', offert: 'Offert', net: 'Net sales', average: 'Average order',
    payments: 'PAYMENTS', cash: 'Cash', card: 'Card', services: 'SERVICE', dineIn: 'Dine in', takeAway: 'Take away', online: 'Online',
    cancellations: 'CANCELLATIONS', none: 'None', by: 'By', products: 'PRODUCTS',
    profit: 'PROFIT', ingredients: 'Ingredient cost', gross: 'Gross profit', wages: 'Wages', expenses: 'Other expenses', operating: 'Operating profit', incomplete: 'Incomplete costs',
    controls: 'STOCK & CONTROLS', stockValue: 'Stock value', lowStock: 'Low stock', unsynced: 'Unsynced', printFailures: 'Print failures', end: 'END OF REPORT',
  };
  const printed = new Intl.DateTimeFormat(fr ? 'fr-FR' : 'en-GB', {
    timeZone: 'Africa/Casablanca', dateStyle: 'short', timeStyle: 'short', hourCycle: 'h23',
  }).format(report.printedAt);
  const rows: PrinterRow[] = [
    { text: l.title, align: 'center', bold: true },
    ...pair(l.date, report.businessDate), ...pair(l.printed, printed),
    ...pair(l.owner, report.ownerName), ...pair(l.terminal, report.terminalName),
    ...section(l.sales), ...pair(l.orders, String(report.orderCount)),
    ...pair(l.items, String(report.itemCount)), ...pair(l.subtotal, money(report.subtotalCentimes)),
    ...pair(l.offert, `-${money(report.offertCentimes)}`), ...pair(l.net, money(report.netCentimes)),
    ...pair(l.average, money(report.averageCentimes)),
    ...section(l.payments),
    ...report.paymentTotals.flatMap((payment) => pair(`${payment.label === 'Cash' ? l.cash : payment.label === 'Card' ? l.card : payment.label} (${payment.orderCount})`, money(payment.totalCentimes))),
    ...section(l.services),
    ...report.serviceTotals.flatMap((service) => pair(
      service.service === 'dine-in' ? l.dineIn : service.service === 'take-away' ? l.takeAway : l.online,
      String(service.orderCount),
    )),
    ...section(l.cancellations),
    ...(report.cancellations.length ? report.cancellations.flatMap((item) => [
      { text: `${item.receiptNumber} · ${item.reason}`, bold: true },
      { text: `${l.by}: ${item.actorName}` },
    ]) : [{ text: l.none }]),
    ...section(l.products),
    ...(report.products.length ? report.products.flatMap((product) => [
      ...wrap(`${product.quantity} × ${product.name}`).map((text) => ({ text })),
      ...pair('', money(product.totalCentimes)),
    ]) : [{ text: l.none }]),
    ...section(l.profit),
    ...pair(l.ingredients, money(report.ingredientCostCentimes)),
    ...pair(l.gross, money(report.grossProfitCentimes)),
    ...pair(l.wages, money(report.compensationCentimes)),
    ...pair(l.expenses, money(report.expenseCentimes)),
    ...pair(l.operating, money(report.operatingProfitCentimes)),
    ...(report.incompleteCostCount ? pair(l.incomplete, String(report.incompleteCostCount)) : []),
    ...section(l.controls),
    ...pair(l.stockValue, money(report.inventoryValueCentimes)),
    ...pair(l.lowStock, String(report.lowStockCount)),
    ...pair(l.unsynced, String(report.pendingSyncCount)),
    ...pair(l.printFailures, String(report.failedPrintCount)),
    { text: '-'.repeat(WIDTH) }, { text: l.end, align: 'center', bold: true },
  ];
  return rows;
}

export function renderDailyOwnerReport(report: DailyOwnerReport) {
  return reportRows(report).map((row) => row.text).join('\n') + '\n';
}

export function encodeDailyOwnerReport(report: DailyOwnerReport) {
  return encodeWd8260Rows(reportRows(report));
}
