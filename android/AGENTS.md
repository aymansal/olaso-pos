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

- Run `npm run android:sync` from the repository root after web or plugin
  changes.
- The generated project requires Java 21 and Android SDK 36 for Gradle builds.

## Verification

- APP-05 requires a successful Capacitor Android sync.
- APP-11 owns Gradle/APK, offline, restart, migration, and install-over-upgrade
  verification.
