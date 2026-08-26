# Galaxy Tab A9 testing through ADB and WebView CDP

Development-only. Never imported by the React application. Never packaged in
the APK.

## Why this exists

Earlier cards improvised WebView inspection and only described it afterwards in
the ledger. That is how coordinate guessing returned. `scripts/tablet-session.mjs`
is the reusable driver.

## Official sources

- Android offline-first data layer:
  https://developer.android.com/topic/architecture/data-layer/offline-first
- Capacitor SQLite upgrades:
  https://github.com/capacitor-community/sqlite/blob/master/docs/UpgradeDatabaseVersion.md
- Capacitor SQLite transactions:
  https://github.com/capacitor-community/sqlite/blob/master/docs/SQLiteTransaction.md
- Chrome DevTools remote debugging of WebViews:
  https://developer.chrome.com/docs/devtools/remote-debugging/webviews
- Android WebView DevTools:
  https://developer.android.com/develop/ui/views/layout/webapps/debug-chrome-devtools
- Chrome remote debugging via adb:
  https://developer.chrome.com/docs/devtools/remote-debugging

## Native versus React/data decision

Olaso is a Capacitor Android product. The operational record already lives in
the Capacitor SQLite plugin (`PRAGMA user_version` upgrades, serialized
transactions). OPTIONS work belongs in that SQLite database plus Convex plus
the React/data layer. Do not add Room, WorkManager, a second database, or a
Kotlin catalog plugin. WebView debugging already exists on the debug beta
through `WebView.setWebContentsDebuggingEnabled`. Drive it with CDP
`Runtime.evaluate` against selectors. Do not guess screen coordinates.

## Credentials

Set in the agent shell only:

- `OLASO_OWNER_PIN` — six-digit owner PIN
- `OLASO_CASHIER_PIN` — six-digit cashier PIN

Never print, log, commit, or write these values. The driver reads them from
the environment and injects them into the lock-screen input through CDP.

Seeded profile names used by the driver:

- Owner: `Olaso Owner`
- Cashier: `Samira Barista`

## Commands

Prefer one long-lived process. Do not chain reconnecting one-shot commands
after `force-stop` — that races the lock screen.

```
node scripts/tablet-session.mjs smoke
node scripts/tablet-session.mjs restart
node scripts/tablet-session.mjs unlock owner
node scripts/tablet-session.mjs unlock cashier
node scripts/tablet-session.mjs click Products
node scripts/tablet-session.mjs text
node scripts/tablet-session.mjs dump
```

`smoke` restarts the app, unlocks as owner, checks 1340×800, opens Products,
returns to POS, restarts, unlocks as cashier, asserts Products is hidden, and
dumps console/logcat — all in one Node process.

`click` accepts a visible button label (for example `Products`) or a CSS
selector. `dump` prints viewport, visible main text, WebView console messages,
and a filtered logcat slice. It never prints PIN values.

ADB defaults to `D:/Olaso/tmp/android-toolchain/android-sdk/platform-tools/adb.exe`
or `ANDROID_ADB`.

The driver forwards `webview_devtools_remote_<pid>` the same way
`scripts/measure-android-baseline.mjs` already does.

## Card smoke, minimum

1. Wake the tablet. Confirm one device.
2. Install the current debug APK over the existing app.
3. Unlock as owner. Confirm POS at 1340 by 800.
4. Run the card-specific workflow through selectors.
5. Unlock as cashier. Confirm owner-only screens are unreachable.
6. Flight mode, restart, reconnect as required by the card.
7. `dump` must show no new WebView or Capacitor error.
