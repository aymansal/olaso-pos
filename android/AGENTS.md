# Android Shell DOX

## Purpose

Owns the Capacitor-generated Android application shell for `com.olaso.pos`.

## Local Contracts

- Keep the application ID unchanged across beta and production upgrades.
- Treat `capacitor.settings.gradle` and `app/capacitor.build.gradle` as
  generated files; change plugin dependencies through npm and Capacitor sync.
- Do not commit `local.properties`, keystores, signing credentials, generated
  APK/AAB files, or copied web assets.
- Do not add ESC/POS, Bluetooth/USB printer transport, or printer permissions
  in Goal 02.
- Goal 03 production printing uses the verified WD8260 Ethernet/LAN path through
  one minimal native TCP socket plugin. Keep the USB receipt lab outside the
  APK and do not add Android USB/Bluetooth branches without a later confirmed
  requirement.
- `EscPosPrinterPlugin.kt` validates the native call boundary and translates
  observable failures; `LanSocketWriter.kt` owns bounded connect/write/flush/
  close behavior. Neither claims paper status from a successful socket write.
- `SecureSessionPlugin.kt` is the Android Keystore-backed boundary for opaque
  identity-session tokens and offline PIN verifiers. It stores encrypted values
  only; plaintext credentials never enter SharedPreferences, logs, or plugin
  return values beyond an explicit read to the authenticated web runtime.
  Related per-profile values are encrypted first and applied through one
  checked SharedPreferences commit so process death or a failed write cannot
  persist a half-old, half-new credential bundle.
- Application Auto Backup is disabled; `data_extraction_rules` and
  `fullBackupContent` exclude database, shared preferences, and related domains
  from cloud and device-to-device transfer.
- Capacitor logging remains disabled because generic plugin-call logging can
  expose protected values. Signed release builds keep `debuggable false`.
  Physical WebView CDP QA uses the debug beta APK, not the distributed
  release. Focused QA also uses filtered Android runtime checks. Before any
  café-client handoff, the release gate in `tools/release/README.md` must reconfirm
  `debuggable false` plus update-channel versionCode/signing readiness.
- First in-app update on a tablet needs Android **Install unknown apps** allowed
  for Olaso POS; afterward Settings → About → Update uses PackageInstaller.
- The same minimal native boundary reports Android-validated internet state and
  emits one change event. Preserve callback cleanup and never treat Wi-Fi
  association alone as online.
- Keep web application behavior in `src/`; native code is only for required
  platform integration.
- Startup uses the already-installed AndroidX system SplashScreen with a plain
  cream splash drawable, cream post-launch/window/WebView surface, and no
  native logo. The adaptive and Android-24 fallback launcher preserve the
  original full white-on-sage OLASO composition inside Android's safe zone.
  Keep all five traced glyph paths unchanged. MainActivity retains the
  SplashScreen exit overlay until Capacitor's existing
  `WebViewListener.onPageCommitVisible` or a real page failure releases it;
  do not restore `postVisualStateCallback`, add a timer, splash plugin,
  Activity, crop the launcher mark, or show default Capacitor artwork.
- Keep the POS activity in sensor-aware landscape and immersive fullscreen;
  system bars may appear transiently after an edge swipe.
- `OlasoWebView` enables Android wide-viewport and overview mode before the
  page loads so the fixed 1340-pixel HTML viewport fits by width. Preserve the
  `match_parent` bridge layout and invalidate the WebView on handled
  configuration changes; do not reintroduce JavaScript/CSS zoom listeners.
  The fixed viewport disables user/focus scaling so a small input cannot leave
  the whole application zoomed after the keyboard closes.
- `OlasoWebView` guards Capacitor/Cordova lifecycle event evaluation until
  `window.Capacitor.triggerEvent` exists. This prevents pre-bridge pause/resume
  errors during screen-off or notification-shade launch while leaving ordinary
  bridge scripts and later lifecycle events unchanged.
- `MainActivity.onDestroy()` queues rollback of any unfinished `olaso_pos`
  transaction and then connection cleanup on its existing Capacitor plugin
  thread before the bridge's safe shutdown. Do not close from the Android UI
  thread or close before rollback: an unfinished transaction keeps the SQLite
  pool locked. The installed plugin has no destroy cleanup; removing ordered
  rollback/close blocks the next same-process Android warm launch.
- Android 16 ignores ordinary orientation restrictions for API-36-targeted
  large-screen apps. This manually distributed fixed-landscape POS therefore
  compiles with SDK 36 but targets API 35. Preserve the activity-level
  `PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY=true` compatibility opt-out
  while the approved interface remains fixed-landscape; verify forced-portrait
  launch behavior on the physical tablet after manifest changes.
- Keep the approved 2,441-byte NV logo as an exact `res/raw` asset. Native code
  may load it only for the deliberate setup action and must not regenerate,
  rasterize, or send it with ordinary receipts.

## Workflow

- Run `npm run check:android` before native packaging changes.
- Run `npm run android:sync` from the repository root after web or plugin
  changes.
- Run `npm run android:beta` for the checked development beta build. Its
  ignored output is `android/app/build/outputs/apk/debug/app-debug.apk`.
- Run `npm run android:production` for a client-tablet build. It obtains the
  production Convex URL directly from the production deployment, verifies that
  URL is embedded in the web bundle, then packages the same debug APK for
  physical QA. Never install `android:beta` as a production-client update.
- The beta build runs app JVM unit tests before assembly, including exact socket
  bytes and closed-endpoint behavior for the native LAN writer.
- Run `npm run android:release` only when upload-keystore env vars are set.
  Signed output is `android/app/build/outputs/apk/release/app-release.apk`.
  Custody and HTTPS update publishing live in `tools/release/README.md`.
- The client tablet now uses the durable signed release (1.2/code9 baseline).
  Do not replace it with `android:production`'s ordinary debug-key QA APK:
  that certificate differs and cannot upgrade the client installation. Normal
  client delivery uses the same durable key, a higher code, production endpoint
  verification, and the non-debug release. Never uninstall for a routine update.
- `AppUpdatePlugin` owns HTTPS APK download, SHA-256 verification, package /
  version / signing-certificate checks, and PackageInstaller user confirmation.
  Do not embed a GitHub credential in the APK.
- Every native implementation card installs the current APK on the connected
  physical Galaxy Tab A9 and records its focused console/logcat/hardware smoke
  test before the card is done.
- The generated project requires Java 21 and Android SDK 36 for Gradle builds.

## Verification

- APP-05 requires a successful Capacitor Android sync.
- APP-11 originally verified the API-36-targeted beta on an API-35 emulator:
  Gradle/APK,
  offline startup and checkout, process-restart recovery, schema 2-to-4
  migration, install-over-upgrade, and acknowledged Convex synchronization.
- A physical Galaxy Tab A9 SM-X115 verified the full 1340 × 800 composition,
  touch hit testing, and cart survival across POS navigation. Production
  signing and the remaining hardware acceptance checks are still required.
