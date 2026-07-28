import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const androidDirectory = fileURLToPath(new URL('../android/', import.meta.url));
const wrapper = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const result = spawnSync(wrapper, ['assembleDebug', '--no-daemon'], {
  cwd: androidDirectory,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(
  'Development beta APK: android/app/build/outputs/apk/debug/app-debug.apk',
);
