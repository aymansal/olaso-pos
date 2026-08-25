import { Capacitor, registerPlugin } from '@capacitor/core';

export type InstalledAppInfo = {
  packageId: string;
  versionCode: number;
  versionName: string;
  signingCertSha256: string;
};

export type UpdateManifest = {
  packageId: string;
  versionCode: number;
  versionName: string;
  apkUrl: string;
  sha256: string;
  notes?: string;
};

export type UpdateAvailability =
  | { status: 'unavailable'; reason: string }
  | { status: 'current'; installed: InstalledAppInfo }
  | {
      status: 'available';
      installed: InstalledAppInfo;
      manifest: UpdateManifest;
    };

type AppUpdatePlugin = {
  getInstalledInfo(): Promise<InstalledAppInfo>;
  canRequestInstalls(): Promise<{ allowed: boolean }>;
  openInstallPermissionSettings(): Promise<{ ok: true } | NativeFailure>;
  downloadApk(options: {
    url: string;
    sha256: string;
  }): Promise<
    | { ok: true; path: string; bytes: number; sha256: string }
    | NativeFailure
  >;
  installApk(options: {
    path: string;
    packageId: string;
    versionCode: number;
    signingCertSha256: string;
  }): Promise<
    | { ok: true; sessionId: number; awaitingUserConfirmation: true }
    | NativeFailure
  >;
};

type NativeFailure = {
  ok: false;
  code: string;
  stage: string;
  message: string;
};

const nativeUpdate = registerPlugin<AppUpdatePlugin>('AppUpdate');

const PACKAGE_ID = 'com.olaso.pos';
const SHA256_HEX = /^[a-f0-9]{64}$/;

function unavailable(message: string): never {
  throw Object.assign(new Error(message), { code: 'UNAVAILABLE' });
}

function manifestUrl(): string {
  const value = import.meta.env.VITE_OLASO_UPDATE_MANIFEST_URL;
  return typeof value === 'string' ? value.trim() : '';
}

export function isUpdateChannelConfigured() {
  return manifestUrl().startsWith('https://');
}

export async function readInstalledAppInfo(): Promise<InstalledAppInfo | null> {
  if (!Capacitor.isNativePlatform()) return null;
  return nativeUpdate.getInstalledInfo();
}

function parseManifest(raw: unknown): UpdateManifest {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Update manifest is invalid.');
  }
  const value = raw as Record<string, unknown>;
  const packageId = typeof value.packageId === 'string' ? value.packageId.trim() : '';
  const versionName =
    typeof value.versionName === 'string' ? value.versionName.trim() : '';
  const apkUrl = typeof value.apkUrl === 'string' ? value.apkUrl.trim() : '';
  const sha256 =
    typeof value.sha256 === 'string'
      ? value.sha256.trim().toLowerCase()
      : '';
  const versionCode =
    typeof value.versionCode === 'number'
      ? value.versionCode
      : Number(value.versionCode);
  const notes = typeof value.notes === 'string' ? value.notes.trim() : undefined;

  if (packageId !== PACKAGE_ID) {
    throw new Error('Update manifest package ID is not Olaso POS.');
  }
  if (!Number.isInteger(versionCode) || versionCode < 1) {
    throw new Error('Update manifest version code is invalid.');
  }
  if (!versionName) {
    throw new Error('Update manifest version name is missing.');
  }
  if (!apkUrl.startsWith('https://')) {
    throw new Error('Update APK URL must use HTTPS.');
  }
  if (!SHA256_HEX.test(sha256)) {
    throw new Error('Update manifest checksum is invalid.');
  }

  return { packageId, versionCode, versionName, apkUrl, sha256, notes };
}

export async function checkForAppUpdate(): Promise<UpdateAvailability> {
  const url = manifestUrl();
  if (!url.startsWith('https://')) {
    return {
      status: 'unavailable',
      reason: 'No HTTPS update channel is configured for this build.',
    };
  }
  if (!Capacitor.isNativePlatform()) {
    return {
      status: 'unavailable',
      reason: 'Updates install only on the Android tablet.',
    };
  }

  const installed = await nativeUpdate.getInstalledInfo();
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Update check failed (${response.status}).`);
  }
  const manifest = parseManifest(await response.json());
  if (manifest.versionCode <= installed.versionCode) {
    return { status: 'current', installed };
  }
  return { status: 'available', installed, manifest };
}

export async function installAvailableUpdate(
  manifest: UpdateManifest,
  options: { hasUnfinishedCart: boolean },
): Promise<{ awaitingUserConfirmation: true }> {
  if (options.hasUnfinishedCart) {
    throw new Error('Finish or clear the open order before installing an update.');
  }
  if (!Capacitor.isNativePlatform()) {
    unavailable('Updates install only on the Android tablet.');
  }

  const permission = await nativeUpdate.canRequestInstalls();
  if (!permission.allowed) {
    const opened = await nativeUpdate.openInstallPermissionSettings();
    if ('ok' in opened && opened.ok === false) {
      throw new Error(opened.message);
    }
    throw new Error(
      'Allow Olaso to install updates in Android settings, then tap Update again.',
    );
  }

  const installed = await nativeUpdate.getInstalledInfo();
  if (manifest.packageId !== installed.packageId) {
    throw new Error('Update package ID did not match this tablet.');
  }
  if (manifest.versionCode <= installed.versionCode) {
    throw new Error('This tablet already has this version or newer.');
  }

  const downloaded = await nativeUpdate.downloadApk({
    url: manifest.apkUrl,
    sha256: manifest.sha256,
  });
  if (!downloaded.ok) {
    throw new Error(downloaded.message);
  }

  const installedResult = await nativeUpdate.installApk({
    path: downloaded.path,
    packageId: manifest.packageId,
    versionCode: manifest.versionCode,
    signingCertSha256: installed.signingCertSha256,
  });
  if (!installedResult.ok) {
    throw new Error(installedResult.message);
  }
  return { awaitingUserConfirmation: true };
}
