# Olaso release signing and update channel

Development-only custody and release notes for HARD-06. Nothing here is
imported by the React application or packaged in the APK.

## Signing-key custody

- Create one upload keystore for `com.olaso.pos` and keep it forever for
  install-over-upgrade. Losing it forces a new application ID or a Play App
  Signing recovery path that sideloading does not provide.
- Store the keystore bytes, store password, key alias, and key password only in
  protected secret storage (GitHub Actions secrets and an offline sealed backup
  owned by the shop owner). Never commit them to git.
- Recommended secret names:

  | Secret | Purpose |
  | --- | --- |
  | `OLASO_UPLOAD_KEYSTORE_BASE64` | Base64 of the `.jks` / `.keystore` file |
  | `OLASO_UPLOAD_STORE_PASSWORD` | Keystore password |
  | `OLASO_UPLOAD_KEY_ALIAS` | Key alias |
  | `OLASO_UPLOAD_KEY_PASSWORD` | Key password |

- Local rehearsal may set the same values as environment variables pointing at a
  path under `tmp/` (gitignored). Production builds use CI secrets only.
- Recovery ownership: the shop owner holds the offline backup; the developer
  workstation must not be the only copy.

## Create a rehearsal keystore (local only)

```powershell
keytool -genkeypair -v `
  -keystore tmp/olaso-upload-rehearsal.jks `
  -alias olaso `
  -keyalg RSA -keysize 2048 -validity 10000 `
  -storepass CHANGE_ME -keypass CHANGE_ME `
  -dname "CN=Olaso POS Rehearsal, O=Olaso, C=MA"
```

Then:

```powershell
$env:OLASO_UPLOAD_STORE_FILE = (Resolve-Path tmp/olaso-upload-rehearsal.jks).Path
$env:OLASO_UPLOAD_STORE_PASSWORD = 'CHANGE_ME'
$env:OLASO_UPLOAD_KEY_ALIAS = 'olaso'
$env:OLASO_UPLOAD_KEY_PASSWORD = 'CHANGE_ME'
npm run android:release
```

## Version channel (no GitHub token in the APK)

1. Tag and build the signed APK in the private source repository.
2. Attach the APK to the private GitHub Release as the release record.
3. Publish `olaso-pos-<versionCode>.apk` and `update-manifest.json` to a
   tablet-reachable HTTPS host (preferred: a dedicated public binary-only
   repository). Never put a GitHub PAT in the APK.
4. Point the tablet build at that manifest with
   `VITE_OLASO_UPDATE_MANIFEST_URL` at build time.

Manifest shape:

```json
{
  "packageId": "com.olaso.pos",
  "versionCode": 3,
  "versionName": "0.1.0-rc.1",
  "apkUrl": "https://example.invalid/releases/olaso-pos-3.apk",
  "sha256": "<lowercase hex>",
  "notes": "Optional short operator notes."
}
```

Generate checksum and manifest locally with:

```powershell
node scripts/write-release-manifest.mjs path/to/app-release.apk https://example.invalid/releases/olaso-pos-3.apk
```

## Operator update flow

1. Owner opens Settings → About.
2. Check for update reads only the HTTPS manifest.
3. Update downloads the APK, verifies SHA-256, package ID, higher version code,
   and the same signing certificate, then starts Android's PackageInstaller
   confirmation. Later dismisses the prompt. An unfinished cart blocks install.
4. Rollback rebuilds the known-good source with a **new higher** version code
   and the same signing key; Android rejects a lower version code.

## Install-over-upgrade notes

- Debug and release use different certificates. Moving a tablet from a debug APK
  to the first signed release requires uninstall (and clears local SQLite) or a
  fresh device.
- After the first signed install, later signed builds with the same cert and a
  higher `versionCode` upgrade in place and must preserve SQLite, Settings, and
  protected staff access.
