import type { ReceiptSnapshotForPrint } from '../printing/receiptModel.ts';
import {
  recordSalePrintAttempt,
  recordSalePrintFailure,
  recordSalePrintSuccess,
} from './printState.ts';
import { loadTerminalSettings } from './terminalSettings.ts';
import { printReceipt } from '../printing/printReceipt.ts';
import { describePrinterFailure } from '../printing/testPrinter.ts';

type Dependencies = {
  recordAttempt: typeof recordSalePrintAttempt;
  loadSettings: typeof loadTerminalSettings;
  sendReceipt: typeof printReceipt;
  recordSuccess: typeof recordSalePrintSuccess;
  recordFailure: typeof recordSalePrintFailure;
};

const dependencies: Dependencies = {
  recordAttempt: recordSalePrintAttempt,
  loadSettings: loadTerminalSettings,
  sendReceipt: printReceipt,
  recordSuccess: recordSalePrintSuccess,
  recordFailure: recordSalePrintFailure,
};

export async function attemptSaleReceiptPrint(
  sale: { localSaleId: string; receipt: ReceiptSnapshotForPrint },
  operations: Dependencies = dependencies,
) {
  try {
    await operations.recordAttempt(sale.localSaleId);
    const settings = await operations.loadSettings();
    const result = await operations.sendReceipt(sale.receipt, settings);
    await operations.recordSuccess(sale.localSaleId, result);
    return {
      state: 'printed' as const,
      message: 'Receipt sent; confirm paper.',
    };
  } catch (caught) {
    const code = typeof caught === 'object' && caught && 'code' in caught
      ? String(caught.code)
      : 'UNKNOWN';
    const message = describePrinterFailure(caught);
    await operations.recordFailure(sale.localSaleId, { code, message })
      .catch(() => undefined);
    return {
      state: 'failed' as const,
      message: `${message} Reprint remains available.`,
    };
  }
}
