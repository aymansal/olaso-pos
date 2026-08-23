import {
  Capacitor,
  registerPlugin,
  type PluginListenerHandle,
} from '@capacitor/core';

type NetworkStatus = { available: boolean };

type SecureSessionPlugin = {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
  monotonicClock(): Promise<{ elapsedRealtime: number; bootCount: number }>;
  networkStatus(): Promise<NetworkStatus>;
  addListener(
    eventName: 'networkStatusChanged',
    listener: (status: NetworkStatus) => void,
  ): Promise<PluginListenerHandle>;
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

export async function readSecureSessionClock() {
  if (!Capacitor.isNativePlatform()) throw unavailable();
  const clock = await nativeSecureSession.monotonicClock();
  if (!Number.isSafeInteger(clock.elapsedRealtime) || clock.elapsedRealtime < 0
      || !Number.isSafeInteger(clock.bootCount) || clock.bootCount < 0) {
    throw new Error('Protected session clock is unavailable.');
  }
  return clock;
}

export async function readSecureSessionNetworkStatus() {
  if (!Capacitor.isNativePlatform()) throw unavailable();
  const status = await nativeSecureSession.networkStatus();
  if (typeof status.available !== 'boolean') {
    throw new Error('Protected network status is unavailable.');
  }
  return status.available;
}

export async function watchSecureSessionNetworkStatus(
  listener: (available: boolean) => void,
) {
  if (!Capacitor.isNativePlatform()) throw unavailable();
  const handle = await nativeSecureSession.addListener(
    'networkStatusChanged',
    (status) => {
      if (typeof status.available === 'boolean') listener(status.available);
    },
  );
  return () => { void handle.remove(); };
}
