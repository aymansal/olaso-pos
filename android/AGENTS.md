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
- Keep web application behavior in `src/`; native code is only for required
  platform integration.

## Workflow

- Run `npm run check:android` before native packaging changes.
- Run `npm run android:sync` from the repository root after web or plugin
  changes.
- Run `npm run android:beta` for the checked development beta build. Its
  ignored output is `android/app/build/outputs/apk/debug/app-debug.apk`.
- The generated project requires Java 21 and Android SDK 36 for Gradle builds.
- The Goal 02 beta uses Android's local debug identity. Production signing and
  distribution remain later release work.

## Verification

- APP-05 requires a successful Capacitor Android sync.
- APP-11 verified the API-36-targeted beta on an API-35 emulator: Gradle/APK,
  offline startup and checkout, process-restart recovery, schema 2-to-4
  migration, install-over-upgrade, and acknowledged Convex synchronization.
- Real Galaxy Tab A9 and production-signature acceptance remain release checks.
