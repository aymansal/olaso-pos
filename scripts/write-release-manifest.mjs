import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const apkPath = process.argv[2];
const apkUrl = process.argv[3];
const notes = process.argv[4] ?? '';

if (!apkPath || !apkUrl) {
  console.error(
    'Usage: node scripts/write-release-manifest.mjs <apk> <https-apk-url> [notes]',
  );
  process.exit(1);
}

if (!apkUrl.startsWith('https://')) {
  console.error('APK URL must use HTTPS.');
  process.exit(1);
}

const appBuild = readFileSync('android/app/build.gradle', 'utf8');
const versionCode = Number(appBuild.match(/versionCode\s+(\d+)/)?.[1]);
const versionName = appBuild.match(/versionName\s+"([^"]+)"/)?.[1];
assert.ok(Number.isInteger(versionCode) && versionCode > 0);
assert.ok(versionName);

const bytes = readFileSync(resolve(apkPath));
const sha256 = createHash('sha256').update(bytes).digest('hex');
const manifest = {
  packageId: 'com.olaso.pos',
  versionCode,
  versionName,
  apkUrl,
  sha256,
  ...(notes ? { notes } : {}),
};

const outPath = resolve(`tmp/${basename(apkPath, '.apk')}-update-manifest.json`);
writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(outPath);
console.log(`sha256 ${sha256}`);
console.log(`versionCode ${versionCode} versionName ${versionName}`);
