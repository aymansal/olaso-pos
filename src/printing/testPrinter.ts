import type { PrinterPreferences } from '../data/terminalSettings';
import { createPrinterTestBytes } from './printerDiagnostic';
import { writePrinterBytes } from './printerTransport';

export function testPrinterConnection(printer: PrinterPreferences) {
  return writePrinterBytes({
    host: printer.printerHost,
    port: printer.printerPort,
    bytes: createPrinterTestBytes(),
  });
}

export function describePrinterFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/Printer (?:address|port) must/.test(message)) {
    return message;
  }
  const code = typeof error === 'object' && error && 'code' in error
    ? String(error.code)
    : '';
  if (code === 'CONFIGURATION') {
    return 'Enter a valid printer IPv4 address and port.';
  }
  if (code === 'UNAVAILABLE') {
    return 'Printer testing is available in the installed Android app.';
  }
  if (code === 'TIMEOUT') {
    return 'Printer connection timed out. Check power, cable, and address.';
  }
  if (code === 'UNREACHABLE') {
    return 'Printer is unavailable. Check power, cable, and address.';
  }
  if (code === 'WRITE_FAILED') {
    return 'Printer connection opened, but test data could not be written.';
  }
  return 'Printer test failed. Check the settings and try again.';
}
