import { Capacitor, registerPlugin } from '@capacitor/core';

type DocumentExportPlugin = {
  saveText(options: {
    fileName: string;
    text: string;
  }): Promise<{ ok: true; bytesWritten: number }>;
  openText(): Promise<{ ok: true; text: string; bytesRead: number }>;
};

const nativeExport = registerPlugin<DocumentExportPlugin>('DocumentExport');

function unavailable() {
  return Object.assign(
    new Error('Backup export is available in the installed Android app.'),
    { code: 'UNAVAILABLE' },
  );
}

export async function saveTextDocument(fileName: string, text: string) {
  if (!Capacitor.isNativePlatform()) throw unavailable();
  try {
    return await nativeExport.saveText({ fileName, text });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    if (/cancel/i.test(message)) {
      throw Object.assign(new Error('Export cancelled.'), { code: 'CANCELLED' });
    }
    throw Object.assign(
      new Error('The backup file could not be saved.'),
      { code: 'UNKNOWN' },
    );
  }
}

export async function openTextDocument() {
  if (!Capacitor.isNativePlatform()) throw unavailable();
  try {
    return await nativeExport.openText();
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : String(caught);
    if (/cancel/i.test(message)) {
      throw Object.assign(new Error('Backup open cancelled.'), { code: 'CANCELLED' });
    }
    throw Object.assign(
      new Error('The backup file could not be opened.'),
      { code: 'UNKNOWN' },
    );
  }
}
