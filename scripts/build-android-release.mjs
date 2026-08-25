import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const required = [
  'OLASO_UPLOAD_STORE_FILE',
  'OLASO_UPLOAD_STORE_PASSWORD',
  'OLASO_UPLOAD_KEY_ALIAS',
  'OLASO_UPLOAD_KEY_PASSWORD',
];

for (const name of required) {
  if (!process.env[name]?.trim()) {
    console.error(
      `Missing ${name}. See tools/release/README.md for signing custody.`,
    );
    process.exit(1);
  }
}

const storeFile = process.env.OLASO_UPLOAD_STORE_FILE.trim();
if (!existsSync(storeFile)) {
  console.error(`Keystore not found: ${storeFile}`);
  process.exit(1);
}

const androidDirectory = fileURLToPath(new URL('../android/', import.meta.url));
const windows = process.platform === 'win32';
const command = windows ? process.env.ComSpec ?? 'cmd.exe' : './gradlew';
const args = windows
  ? ['/d', '/s', '/c', 'gradlew.bat testReleaseUnitTest assembleRelease --no-daemon']
  : ['testReleaseUnitTest', 'assembleRelease', '--no-daemon'];

const result = spawnSync(command, args, {
  cwd: androidDirectory,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(
  'Signed release APK: android/app/build/outputs/apk/release/app-release.apk',
);
