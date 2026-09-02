import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

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
const webView = readFileSync(
  'android/app/src/main/java/com/olaso/pos/OlasoWebView.java',
  'utf8',
);
const bridgeLayout = readFileSync(
  'android/app/src/main/res/layout/capacitor_bridge_layout_main.xml',
  'utf8',
);
const launchTheme = readFileSync(
  'android/app/src/main/res/values/styles.xml',
  'utf8',
);
const launchColors = readFileSync(
  'android/app/src/main/res/values/ic_launcher_background.xml',
  'utf8',
);
const launchWordmark = readFileSync(
  'android/app/src/main/res/drawable/olaso_launch_blank.xml',
  'utf8',
);
const launcherWordmark = readFileSync(
  'android/app/src/main/res/drawable/olaso_launcher_foreground.xml',
  'utf8',
);
const adaptiveLauncher = readFileSync(
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'utf8',
);
const adaptiveRoundLauncher = readFileSync(
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
  'utf8',
);
const legacyLauncher = readFileSync(
  'android/app/src/main/res/mipmap-anydpi-v24/ic_launcher.xml',
  'utf8',
);
const exactBrandTrace = readFileSync(
  'tools/wd8260-receipt-lab/assets/olaso-wordmark-black.svg',
  'utf8',
);
const startupProvider = readFileSync('src/data/AppDataProvider.tsx', 'utf8');
const application = readFileSync('src/App.tsx', 'utf8');
const index = readFileSync('index.html', 'utf8');
const main = readFileSync('src/main.tsx', 'utf8');

assert.equal(capacitor.appId, 'com.olaso.pos');
assert.equal(capacitor.backgroundColor, '#F8F7EA');
assert.equal(capacitor.plugins.SystemBars.insetsHandling, 'disable');
assert.match(appBuild, /namespace = "com\.olaso\.pos"/);
assert.match(appBuild, /applicationId "com\.olaso\.pos"/);
assert.match(appBuild, /versionCode 8/);
assert.match(appBuild, /versionName "1\.1"/);
assert.match(variables, /compileSdkVersion = 36/);
assert.match(variables, /targetSdkVersion = 35/);
assert.match(manifest, /android\.permission\.INTERNET/);
assert.match(manifest, /android\.permission\.ACCESS_NETWORK_STATE/);
assert.match(manifest, /android:screenOrientation="sensorLandscape"/);
assert.match(
  manifest,
  /android\.window\.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY"\s+android:value="true"/,
);
assert.match(index, /content="width=1340,/);
assert.match(index, /user-scalable=no/);
assert.doesNotMatch(index, /initial-scale/);
assert.match(index, /class="olaso-startup"/);
assert.match(index, /data-olaso-startup="document"/);
assert.match(index, /olaso-wordmark-operational-green-transparent\.png/);
assert.match(index, /olaso_startup_first/);
assert.doesNotMatch(index, /Starting Olaso…/);
assert.doesNotMatch(main, /Capacitor|zoom|innerWidth|outerWidth|screen\.width/);
assert.match(launchColors, /name="ic_launcher_background">#909F78/);
assert.match(launchColors, /name="olaso_cream">#F8F7EA/);
assert.match(launchColors, /name="olaso_operational_green">#006A2B/);
assert.match(launchTheme, /parent="Theme\.SplashScreen"/);
assert.match(launchTheme, /name="windowSplashScreenBackground">@color\/olaso_cream/);
assert.match(
  launchTheme,
  /name="windowSplashScreenAnimatedIcon">@drawable\/olaso_launch_blank/,
);
assert.match(launchTheme, /name="postSplashScreenTheme">@style\/AppTheme\.NoActionBar/);
assert.doesNotMatch(launchTheme, /@drawable\/splash/);
assert.match(bridgeLayout, /android:background="@color\/olaso_cream"/);
for (const launcher of [adaptiveLauncher, adaptiveRoundLauncher, legacyLauncher]) {
  assert.match(launcher, /@color\/ic_launcher_background/);
  assert.match(launcher, /@drawable\/olaso_launcher_foreground/);
}
const sourceBrandPaths = [...exactBrandTrace.matchAll(/<path\b([^>]*)\/?\s*>/g)]
  .filter((match) => match[1].match(/opacity="([^"]+)"/)?.[1] === '1')
  .map((match) => match[1].match(/\bd="([^"]+)"/)?.[1].trim());
assert.equal(sourceBrandPaths.length, 5);
assert.match(launchWordmark, /<solid android:color="@color\/olaso_cream"/);
for (const drawable of [launcherWordmark]) {
  assert.match(drawable, /android:viewportWidth="2087"/);
  assert.match(drawable, /android:viewportHeight="2087"/);
  assert.match(drawable, /android:scaleX="0\.61"/);
  assert.match(drawable, /android:scaleY="0\.61"/);
  assert.deepEqual(
    [...drawable.matchAll(/android:pathData="([^"]+)"/g)].map((match) => match[1]),
    sourceBrandPaths,
  );
}
assert.match(launcherWordmark, /android:fillColor="#FFFFFF"/);
assert.match(startupProvider, /<img className=\{styles\.logo\} src=\{olasoLogo\}/);
assert.match(startupProvider, /data-olaso-startup="database"/);
assert.match(startupProvider, /<StartupDots \/>/);
assert.match(application, /<img className=\{startupStyles\.logo\} src=\{olasoLogo\}/);
assert.match(application, /data-olaso-startup="access"/);
assert.match(application, /<StartupDots \/>/);
assert.match(
  application,
  /aria-label=\{translate\(language, 'Terminal locked'\)\} role="alert">[\s\S]*?<img className=\{startupStyles\.logo\}[\s\S]*?Staff session is unavailable/,
);
assert.match(
  application,
  /aria-label=\{translate\(language, 'Terminal recovery'\)\} role="alert">[\s\S]*?<img className=\{startupStyles\.logo\}/,
);
assert.match(webView, /extends CapacitorWebView/);
assert.match(webView, /setUseWideViewPort\(true\)/);
assert.match(webView, /setLoadWithOverviewMode\(true\)/);
assert.match(webView, /@Override\s+public void evaluateJavascript/);
assert.match(webView, /guardCapacitorEventScript/);
assert.match(webView, /typeof window\.Capacitor\.triggerEvent === 'function'/);
assert.match(
  bridgeLayout,
  /<com\.olaso\.pos\.OlasoWebView[\s\S]*?android:layout_width="match_parent"[\s\S]*?android:layout_height="match_parent"/,
);
const printerPlugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/EscPosPrinterPlugin.kt',
  'utf8',
);
const secureSessionPlugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/SecureSessionPlugin.kt',
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
assert.match(activity, /WindowInsetsCompat\.Type\.systemBars\(\)/);
assert.match(activity, /SplashScreen\.installSplashScreen\(this\)[\s\S]*?super\.onCreate/);
assert.match(activity, /setOnExitAnimationListener\(splash ->/);
assert.match(activity, /launchSplash = splash/);
assert.match(activity, /launchSplash\.remove\(\)/);
assert.doesNotMatch(activity, /setKeepOnScreenCondition/);
assert.match(
  activity,
  /addWebViewListener\(new WebViewListener\(\)[\s\S]*?onPageCommitVisible\(WebView webView, String url\)[\s\S]*?finishLaunch\(\)/,
);
assert.doesNotMatch(activity, /postVisualStateCallback/);
assert.match(activity, /onReceivedError\(WebView webView\)[\s\S]*?finishLaunch\(\)/);
assert.match(activity, /onReceivedHttpError\(WebView webView\)[\s\S]*?finishLaunch\(\)/);
assert.doesNotMatch(activity, /postDelayed|Thread\.sleep|setTimeout/);
assert.match(activity, /BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE/);
assert.match(activity, /onConfigurationChanged/);
assert.match(activity, /getBridge\(\)\.getWebView\(\)\.invalidate\(\)/);
assert.match(activity, /public void onDestroy\(\)/);
assert.match(activity, /getBridge\(\)\.getPlugin\("CapacitorSQLite"\)/);
assert.match(activity, /options\.put\("database", "olaso_pos"\)/);
assert.match(
  activity,
  /getBridge\(\)\.execute\(\(\) ->[\s\S]*?rollbackTransaction\(closeCall\)[\s\S]*?closeConnection\(closeCall\)[\s\S]*?super\.onDestroy\(\)/,
);
assert.match(activity, /registerPlugin\(EscPosPrinterPlugin\.class\)/);
assert.match(activity, /registerPlugin\(SecureSessionPlugin\.class\)/);
assert.match(activity, /registerPlugin\(AppUpdatePlugin\.class\)/);
assert.match(activity, /WebView\.setWebContentsDebuggingEnabled\(true\)/);
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
const updatePlugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/AppUpdatePlugin.kt',
  'utf8',
);
assert.match(updatePlugin, /@CapacitorPlugin\(name = "AppUpdate"\)/);
assert.match(updatePlugin, /PackageInstaller/);
assert.match(updatePlugin, /REQUEST_INSTALL|canRequestPackageInstalls/);
assert.match(manifest, /android\.permission\.REQUEST_INSTALL_PACKAGES/);
assert.match(secureSessionPlugin, /@CapacitorPlugin\(name = "SecureSession"\)/);
assert.match(secureSessionPlugin, /AndroidKeyStore/);
assert.match(secureSessionPlugin, /AES\/GCM\/NoPadding/);
assert.match(secureSessionPlugin, /SystemClock\.elapsedRealtime\(\)/);
assert.match(secureSessionPlugin, /BOOT_COUNT/);
assert.match(secureSessionPlugin, /fun networkStatus\(call: PluginCall\)/);
assert.match(secureSessionPlugin, /ConnectivityManager\.NetworkCallback/);
assert.match(secureSessionPlugin, /registerDefaultNetworkCallback/);
assert.match(secureSessionPlugin, /registerNetworkCallback/);
assert.match(secureSessionPlugin, /unregisterNetworkCallback/);
assert.match(secureSessionPlugin, /notifyListeners\(NETWORK_STATUS_CHANGED/);
assert.doesNotMatch(secureSessionPlugin, /Log\.|println|printStackTrace/);
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

assert.match(
  readFileSync('src/features/pos/components/ProductCard/ProductCard.tsx', 'utf8'),
  /width=\{72\}[\s\S]*?height=\{92\}[\s\S]*?decoding="async"/,
);
assert.match(
  readFileSync('src/data/reconnectContext.tsx', 'utf8'),
  /requestIdleCallback\(start, \{ timeout: 750 \}\)/,
);
assert.match(manifest, /android:allowBackup="false"/);
assert.match(manifest, /dataExtractionRules|fullBackupContent/);

console.log('Android beta identity, version, permission, and artifact checks passed.');
