import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const capacitor = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));
const appBuild = readFileSync('android/app/build.gradle', 'utf8');
const variables = readFileSync('android/variables.gradle', 'utf8');
const manifest = readFileSync(
  'android/app/src/main/AndroidManifest.xml',
  'utf8',
);
const activity = readFileSync(
  'android/app/src/main/java/com/olaso/pos/MainActivity.java',
  'utf8',
);
const index = readFileSync('index.html', 'utf8');
const main = readFileSync('src/main.tsx', 'utf8');

assert.equal(capacitor.appId, 'com.olaso.pos');
assert.equal(capacitor.plugins.SystemBars.insetsHandling, 'disable');
assert.match(appBuild, /namespace = "com\.olaso\.pos"/);
assert.match(appBuild, /applicationId "com\.olaso\.pos"/);
assert.match(appBuild, /versionCode 2/);
assert.match(appBuild, /versionName "0\.1\.0-beta\.1"/);
assert.match(variables, /compileSdkVersion = 36/);
assert.match(variables, /targetSdkVersion = 35/);
assert.match(manifest, /android\.permission\.INTERNET/);
assert.match(manifest, /android:screenOrientation="sensorLandscape"/);
assert.match(
  manifest,
  /android\.window\.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY"\s+android:value="true"/,
);
assert.match(index, /width=1340, initial-scale=1\.0/);
assert.match(main, /Capacitor\.isNativePlatform\(\)/);
assert.match(
  main,
  /Math\.max\(window\.screen\.width, window\.screen\.height\) \/ 1340/,
);
assert.match(main, /addEventListener\('resize', applyTabletScale/);
assert.match(main, /screen\.orientation\.addEventListener\('change', applyTabletScale/);
const printerPlugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/EscPosPrinterPlugin.kt',
  'utf8',
);
const socketWriter = readFileSync(
  'android/app/src/main/java/com/olaso/pos/LanSocketWriter.kt',
  'utf8',
);
const rootBuild = readFileSync('android/build.gradle', 'utf8');
const appBuildScript = readFileSync('android/app/build.gradle', 'utf8');
const acceptedLogo = readFileSync(
  'tools/wd8260-receipt-lab/fixtures/nv-logo-write.bin',
);
const nativeLogo = readFileSync(
  'android/app/src/main/res/raw/olaso_nv_logo.bin',
);
assert.doesNotMatch(main, /window\.(?:innerWidth|outerWidth)/);
assert.match(activity, /WindowInsetsCompat\.Type\.systemBars\(\)/);
assert.match(activity, /BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE/);
assert.match(activity, /registerPlugin\(EscPosPrinterPlugin\.class\)/);
assert.match(rootBuild, /com\.android\.tools\.build:gradle:8\.13\.2/);
assert.match(rootBuild, /kotlin-gradle-plugin:2\.3\.21/);
assert.match(appBuildScript, /org\.jetbrains\.kotlin\.android/);
assert.match(printerPlugin, /@CapacitorPlugin\(name = "EscPosPrinter"\)/);
assert.match(printerPlugin, /Base64\.decode/);
assert.match(printerPlugin, /fun installLogo\(call: PluginCall\)/);
assert.match(printerPlugin, /openRawResource\(R\.raw\.olaso_nv_logo\)/);
assert.match(printerPlugin, /put\("ok", false\)/);
assert.doesNotMatch(printerPlugin, /call\.reject/);
assert.match(socketWriter, /Socket\(\)/);
assert.match(socketWriter, /connectTimeoutMs/);
assert.match(socketWriter, /writeTimeoutMs/);
assert.doesNotMatch(printerPlugin + socketWriter, /Bluetooth|Usb|USB/);
assert.deepEqual(nativeLogo, acceptedLogo);
assert.equal(nativeLogo.length, 2441);
assert.deepEqual(
  [...nativeLogo.subarray(0, 9)],
  [0x1b, 0x40, 0x1c, 0x71, 0x01, 38, 0, 8, 0],
);
assert.equal(
  createHash('sha256').update(nativeLogo).digest('hex').toUpperCase(),
  'D5D3B835800970D7F81BD188311EC766DCF4F0867F2E9B697C227AD9F9818C76',
);
assert.match(
  manifest,
  /android\.permission\.USE_BIOMETRIC"[\s\S]*?tools:node="remove"/,
);
assert.match(
  manifest,
  /android\.permission\.USE_FINGERPRINT"[\s\S]*?tools:node="remove"/,
);
assert.doesNotMatch(
  manifest,
  /BLUETOOTH|USB_PERMISSION|MANAGE_USB|ESC_POS|BIND_PRINT_SERVICE/i,
);

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' });
assert.doesNotMatch(
  tracked,
  /(?:^|\/)(?:local\.properties|.*\.(?:apk|aab|jks|keystore|p12|pem|key))$/im,
);

console.log('Android beta identity, version, permission, and artifact checks passed.');
