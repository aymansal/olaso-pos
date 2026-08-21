import { Capacitor, registerPlugin } from '@capacitor/core';

export type PrinterWriteResult = {
  bytesWritten: number;
  connectMs: number;
  writeMs: number;
  totalMs: number;
  paperConfirmed: false;
};

type EscPosPrinterPlugin = {
  write(options: {
    host: string;
    port: number;
    dataBase64: string;
    connectTimeoutMs: number;
    writeTimeoutMs: number;
  }): Promise<
    | ({ ok: true } & PrinterWriteResult)
    | {
      ok: false;
      code: string;
      stage: string;
      message: string;
    }
  >;
};

const nativePrinter = registerPlugin<EscPosPrinterPlugin>('EscPosPrinter');

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

export async function writePrinterBytes(input: {
  host: string;
  port: number;
  bytes: Uint8Array;
  connectTimeoutMs?: number;
  writeTimeoutMs?: number;
}) {
  if (!Capacitor.isNativePlatform()) {
    throw Object.assign(
      new Error('Printer testing is available in the installed Android app.'),
      { code: 'UNAVAILABLE' },
    );
  }
  const result = await nativePrinter.write({
    host: input.host,
    port: input.port,
    dataBase64: toBase64(input.bytes),
    connectTimeoutMs: input.connectTimeoutMs ?? 2000,
    writeTimeoutMs: input.writeTimeoutMs ?? 2000,
  });
  if (!result.ok) {
    throw Object.assign(new Error(result.message), {
      code: result.code,
      stage: result.stage,
    });
  }
  const { ok: _ok, ...writeResult } = result;
  return writeResult;
}
