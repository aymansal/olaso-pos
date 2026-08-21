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
- Keep web application behavior in `src/`; native code is only for required
  platform integration.
- Keep the POS activity in sensor-aware landscape and immersive fullscreen;
  system bars may appear transiently after an edge swipe.
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
- The beta build runs app JVM unit tests before assembly, including exact socket
  bytes and closed-endpoint behavior for the native LAN writer.
- Every native implementation card installs the current APK on the connected
  physical Galaxy Tab A9 and records its focused console/logcat/hardware smoke
  test before the card is done.
- The generated project requires Java 21 and Android SDK 36 for Gradle builds.
- The Goal 02 beta uses Android's local debug identity. Production signing and
  distribution remain later release work.

## Verification

- APP-05 requires a successful Capacitor Android sync.
- APP-11 originally verified the API-36-targeted beta on an API-35 emulator:
  Gradle/APK,
  offline startup and checkout, process-restart recovery, schema 2-to-4
  migration, install-over-upgrade, and acknowledged Convex synchronization.
- A physical Galaxy Tab A9 SM-X115 verified the full 1340 × 800 composition,
  touch hit testing, and cart survival across POS navigation. Production
  signing and the remaining hardware acceptance checks are still required.
