import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const appBuild = readFileSync('android/app/build.gradle', 'utf8');
const manifest = readFileSync(
  'android/app/src/main/AndroidManifest.xml',
  'utf8',
);
const activity = readFileSync(
  'android/app/src/main/java/com/olaso/pos/MainActivity.java',
  'utf8',
);
const updatePlugin = readFileSync(
  'android/app/src/main/java/com/olaso/pos/AppUpdatePlugin.kt',
  'utf8',
);
const appUpdate = readFileSync('src/data/appUpdate.ts', 'utf8');
const releaseReadme = readFileSync('tools/release/README.md', 'utf8');
const workflow = readFileSync('.github/workflows/android-release.yml', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

assert.match(appBuild, /applicationId "com\.olaso\.pos"/);
assert.match(appBuild, /versionCode 6/);
assert.match(appBuild, /versionName "0\.1\.0-rc\.4"/);
assert.match(appUpdate, /No update available/);
assert.match(appUpdate, /aymansal\/olaso-pos-releases/);
assert.equal(
  packageJson.scripts['release:publish'],
  'node scripts/publish-release.mjs',
);
assert.match(appBuild, /signingConfigs/);
assert.match(appBuild, /OLASO_UPLOAD_STORE_FILE/);
assert.match(appBuild, /signingConfig signingConfigs\.release/);

assert.match(manifest, /android\.permission\.REQUEST_INSTALL_PACKAGES/);
assert.match(activity, /registerPlugin\(AppUpdatePlugin\.class\)/);
assert.match(updatePlugin, /@CapacitorPlugin\(name = "AppUpdate"\)/);
assert.match(updatePlugin, /PackageInstaller/);
assert.match(updatePlugin, /https:\/\//);
assert.match(updatePlugin, /SHA-256/);

assert.match(appUpdate, /VITE_OLASO_UPDATE_MANIFEST_URL/);
assert.match(appUpdate, /hasUnfinishedCart/);
assert.match(appUpdate, /signingCertSha256/);
assert.doesNotMatch(appUpdate, /github_pat|GITHUB_TOKEN|ghp_/i);

assert.match(releaseReadme, /OLASO_UPLOAD_KEYSTORE_BASE64/);
assert.match(releaseReadme, /off-repository|offline sealed backup/i);
assert.match(releaseReadme, /higher version code/i);

assert.match(workflow, /OLASO_UPLOAD_KEYSTORE_BASE64/);
assert.match(workflow, /android:release/);
assert.doesNotMatch(workflow, /echo \$\{\{ secrets\./);

assert.equal(packageJson.scripts['check:release'], 'node scripts/check-release.mjs');
assert.equal(
  packageJson.scripts['android:release'],
  'npm run check:release && npm run check:android && npm run android:sync && node scripts/build-android-release.mjs',
);

assert.equal(existsSync('tools/release/README.md'), true);
assert.equal(existsSync('scripts/write-release-manifest.mjs'), true);
assert.equal(existsSync('scripts/build-android-release.mjs'), true);

console.log('check:release passed');
