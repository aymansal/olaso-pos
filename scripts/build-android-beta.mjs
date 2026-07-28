import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const androidDirectory = fileURLToPath(new URL('../android/', import.meta.url));
const windows = process.platform === 'win32';
const command = windows ? process.env.ComSpec ?? 'cmd.exe' : './gradlew';
const args = windows
  ? ['/d', '/s', '/c', 'gradlew.bat assembleDebug --no-daemon']
  : ['assembleDebug', '--no-daemon'];
const result = spawnSync(command, args, {
  cwd: androidDirectory,
  stdio: 'inherit',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(
  'Development beta APK: android/app/build/outputs/apk/debug/app-debug.apk',
);
