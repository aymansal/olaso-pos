import type { PrinterPreferences } from '../data/terminalSettings.ts';
import { validatePrinterPreferences } from '../data/terminalSettings.ts';
import { encodeWd8260Receipt } from './receiptEncoder.ts';
import {
  createReceiptModel,
  type ReceiptSnapshotForPrint,
} from './receiptModel.ts';
import { writePrinterBytes } from './printerTransport.ts';

export function createSavedReceiptBytes(receipt: ReceiptSnapshotForPrint) {
  return encodeWd8260Receipt(createReceiptModel(receipt));
}

export function printReceipt(
  receipt: ReceiptSnapshotForPrint,
  preferences: PrinterPreferences,
) {
  const printer = validatePrinterPreferences(preferences);
  return writePrinterBytes({
    host: printer.printerHost,
    port: printer.printerPort,
    bytes: createSavedReceiptBytes(receipt),
  });
}
