# Galaxy Tab A9 ADB Control Handoff

This file explains how to control the Olaso test tablet from this Windows
workstation. It is for development and support only. It is not imported by the
app and is not packaged into the APK.

## Hardware and app

- Tablet: Samsung Galaxy Tab A9 / SM-X115.
- App package: `com.olaso.pos`.
- Main activity: `com.olaso.pos/.MainActivity`.
- Expected app viewport: `1340 x 800` in landscape.
- Local ADB path:
  `D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe`
- Java for Android builds:
  `D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10`

Do not print or log PINs. If a PIN is needed for automation, pass it through an
environment variable for the current terminal only.

## Why control was reliable

The reliable method was not only screen tapping.

Use ADB for device-level actions:

- wake tablet
- install APK
- launch app
- force-stop app
- take screenshot
- record screen
- read logcat
- enter safe input when needed

Then use the Android WebView debug bridge for app-level actions:

- read visible screen text
- click buttons by label such as `POS`, `Products`, `Settings`
- inspect viewport size
- check browser console messages

This is more stable than guessing coordinates, because labels survive small
layout shifts while coordinates do not.

## First checks

Run these from `D:\Olaso` in PowerShell.

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb devices
& $adb get-serialno
& $adb shell getprop ro.product.model
& $adb shell getprop ro.build.version.release
& $adb shell getprop ro.build.version.sdk
```

Expected:

- one connected device
- model is `SM-X115`
- app testing uses the physical tablet, not an emulator

If the device says `unauthorized`, unlock the tablet and accept the USB
debugging prompt.

## Build and install APK

```powershell
$env:JAVA_HOME = 'D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10'
$env:Path = 'D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10\bin;' + $env:Path
npm run android:beta

$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb install -r 'D:\Olaso\android\app\build\outputs\apk\debug\app-debug.apk'
```

Use `install -r` for normal testing. It preserves the tablet app data.

Do not run `adb uninstall com.olaso.pos` unless the owner explicitly approves
destroying local app data.

## Basic tablet control

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'

& $adb shell input keyevent KEYCODE_WAKEUP
& $adb shell wm dismiss-keyguard
& $adb shell input keyevent KEYCODE_HOME
& $adb shell am force-stop com.olaso.pos
& $adb shell am start -W -n com.olaso.pos/.MainActivity
```

Useful input commands:

```powershell
& $adb shell input tap 670 400
& $adb shell input swipe 1100 700 200 700 300
& $adb shell input text 'abc123'
& $adb shell input keyevent KEYCODE_BACK
& $adb shell input keyevent KEYCODE_HOME
```

Coordinates are last resort. Prefer the repo helper below when controlling the
Olaso app itself.

## Repo helper

The repo has a development-only helper:

```powershell
node scripts/tablet-session.mjs connect
node scripts/tablet-session.mjs restart
node scripts/tablet-session.mjs text
node scripts/tablet-session.mjs dump
node scripts/tablet-session.mjs click POS
node scripts/tablet-session.mjs click Products
```

For protected unlock testing, set PINs only in the current terminal:

```powershell
$env:OLASO_OWNER_PIN = '<six digits>'
$env:OLASO_CASHIER_PIN = '<six digits>'
node scripts/tablet-session.mjs unlock owner
node scripts/tablet-session.mjs unlock cashier
node scripts/tablet-session.mjs smoke
```

The helper redacts six-digit values from output. Still, do not paste real PINs
into markdown, commits, issue text, or chat summaries.

## Screenshots

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb shell screencap -p /sdcard/olaso-screen.png
& $adb pull /sdcard/olaso-screen.png 'D:\Olaso\tmp\olaso-screen.png'
```

Use screenshots when checking layout, clipping, overflow, or the app icon.

## Screen recordings

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb shell screenrecord --time-limit 7 --bit-rate 8000000 /sdcard/olaso-recording.mp4
& $adb pull /sdcard/olaso-recording.mp4 'D:\Olaso\tmp\olaso-recording.mp4'
```

For startup checks, start recording first, then launch the app:

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb shell am force-stop com.olaso.pos
& $adb logcat -c
& $adb shell screenrecord --time-limit 7 --bit-rate 8000000 /sdcard/olaso-startup.mp4
```

In another command, immediately run:

```powershell
& $adb shell am start -W -n com.olaso.pos/.MainActivity
```

Then pull the video:

```powershell
& $adb pull /sdcard/olaso-startup.mp4 'D:\Olaso\tmp\olaso-startup.mp4'
```

## Logcat

Clear logs before the action, perform the action, then read focused logs.

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
& $adb logcat -c
& $adb shell am start -W -n com.olaso.pos/.MainActivity
& $adb logcat -d -s 'Capacitor/Console:E' 'Capacitor:E' 'chromium:E' 'AndroidRuntime:E'
```

Do not call a tablet test clean if logcat contains real errors. Investigate the
root cause or record the blocker honestly.

## WebView inspection method

This is the important part.

Android WebView exposes a debug socket while the debug APK is running. The
helper connects to it through ADB port forwarding:

```powershell
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'
$pid = & $adb shell pidof com.olaso.pos
& $adb forward tcp:9238 "localabstract:webview_devtools_remote_$pid"
```

Then a script can read:

```text
http://127.0.0.1:9238/json/list
```

and connect to the page WebSocket. That allows real DOM checks like:

- `innerWidth` and `innerHeight`
- visible main text
- button clicks by visible label
- console warnings/errors

This is why the existing `scripts/tablet-session.mjs` can do:

```powershell
node scripts/tablet-session.mjs click POS
node scripts/tablet-session.mjs dump
```

instead of using fragile coordinate taps.

## Common QA flow

```powershell
$env:JAVA_HOME = 'D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10'
$env:Path = 'D:\Olaso\tmp\android-toolchain\jdk\jdk-21.0.11+10\bin;' + $env:Path
$adb = 'D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe'

npm run android:beta
& $adb install -r 'D:\Olaso\android\app\build\outputs\apk\debug\app-debug.apk'
& $adb shell am force-stop com.olaso.pos
& $adb logcat -c
node scripts/tablet-session.mjs restart
node scripts/tablet-session.mjs dump
& $adb logcat -d -s 'Capacitor/Console:E' 'Capacitor:E' 'chromium:E' 'AndroidRuntime:E'
```

When checking real app behavior, use `dump` first. It tells you the viewport,
visible text, recent console messages, and focused logcat.

## Rules for Grok or any other agent

- Read the repo docs before changing the app.
- Never uninstall the app unless the owner approves data loss.
- Never log PINs, passwords, signing keys, or printer secrets.
- Prefer `scripts/tablet-session.mjs` for app actions.
- Use raw ADB for device actions.
- Use screenshots or screen recordings for visual claims.
- Use focused logcat after the exact action being tested.
- Treat offline mode as a real production condition.
- If a bug appears, fix the cause. Do not bypass it just to make one test pass.

## Prompt for another agent

Use this prompt when handing tablet control to another AI agent:

```text
You are working in D:\Olaso on Windows PowerShell. Control the connected
Samsung Galaxy Tab A9 through ADB. Use:

D:\Olaso\tmp\android-toolchain\android-sdk\platform-tools\adb.exe

The Olaso app package is com.olaso.pos and the main activity is
com.olaso.pos/.MainActivity. Use adb for wake, install, launch, force-stop,
screenshot, screenrecord, and logcat. For app interaction, prefer the existing
repo helper scripts/tablet-session.mjs because it connects to the Android
WebView debug bridge and can click visible labels, read visible text, inspect
the 1340 x 800 viewport, and collect console messages. Do not rely on tap
coordinates unless there is no label/DOM path.

Never print or store PINs. If unlock automation is needed, receive PINs through
OLASO_OWNER_PIN and OLASO_CASHIER_PIN environment variables in the current
terminal only. Never run adb uninstall com.olaso.pos unless Ayman explicitly
approves deleting the tablet's local data. Use adb install -r for normal APK
updates. Clear logcat before the tested action, then read focused errors after.
Use screenshots or screen recordings before making visual claims.
```

