import { Capacitor, registerPlugin } from '@capacitor/core';

type SecureSessionPlugin = {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
};

const nativeSecureSession = registerPlugin<SecureSessionPlugin>('SecureSession');

function unavailable() {
  return Object.assign(
    new Error('Protected session storage is available in the installed Android app.'),
    { code: 'UNAVAILABLE' },
  );
}

function assertKey(key: string) {
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(key)) {
    throw new Error('Secure session key is invalid.');
  }
}

export async function readSecureSessionValue(key: string) {
  assertKey(key);
  if (!Capacitor.isNativePlatform()) throw unavailable();
  return (await nativeSecureSession.get({ key })).value;
}

export async function writeSecureSessionValue(key: string, value: string) {
  assertKey(key);
  if (value.length > 8192) throw new Error('Secure session value is too long.');
  if (!Capacitor.isNativePlatform()) throw unavailable();
  await nativeSecureSession.set({ key, value });
}

export async function removeSecureSessionValue(key: string) {
  assertKey(key);
  if (!Capacitor.isNativePlatform()) throw unavailable();
  await nativeSecureSession.remove({ key });
}
