import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const RELEASES_REPO = 'aymansal/olaso-pos-releases';
const PACKAGE_ID = 'com.olaso.pos';

const apkArg = process.argv[2];
const notes = process.argv[3] ?? '';

if (!apkArg) {
  console.error(
    'Usage: node scripts/publish-release.mjs <app-release.apk> [notes]',
  );
  process.exit(1);
}

const apkPath = resolve(apkArg);
const appBuild = readFileSync('android/app/build.gradle', 'utf8');
const versionCode = Number(appBuild.match(/versionCode\s+(\d+)/)?.[1]);
const versionName = appBuild.match(/versionName\s+"([^"]+)"/)?.[1];
assert.ok(Number.isInteger(versionCode) && versionCode > 0);
assert.ok(versionName);

const bytes = readFileSync(apkPath);
const sha256 = createHash('sha256').update(bytes).digest('hex');
const assetName = `olaso-pos-${versionCode}.apk`;
const stagedApk = resolve('tmp', assetName);
copyFileSync(apkPath, stagedApk);

const tag = `v${versionName}`;
const apkUrl = `https://github.com/${RELEASES_REPO}/releases/download/${tag}/${assetName}`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
  if (result.status !== 0) {
    const detail = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    throw new Error(
      `${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`,
    );
  }
  return (result.stdout ?? '').trim();
}

const existing = spawnSync(
  'gh',
  ['release', 'view', tag, '--repo', RELEASES_REPO],
  { encoding: 'utf8' },
);
if (existing.status === 0) {
  run('gh', ['release', 'delete', tag, '--repo', RELEASES_REPO, '--yes']);
}

run('gh', [
  'release',
  'create',
  tag,
  stagedApk,
  '--repo',
  RELEASES_REPO,
  '--title',
  `Atelika POS ${versionName}`,
  '--notes',
  notes || `Signed release ${versionName} (versionCode ${versionCode}).`,
]);

const manifest = {
  packageId: PACKAGE_ID,
  versionCode,
  versionName,
  apkUrl,
  sha256,
  ...(notes ? { notes } : {}),
};
const manifestBody = `${JSON.stringify(manifest, null, 2)}\n`;
const manifestPath = resolve('tmp', 'update-manifest.json');
writeFileSync(manifestPath, manifestBody);

let currentSha = '';
const meta = spawnSync(
  'gh',
  ['api', `repos/${RELEASES_REPO}/contents/update-manifest.json`],
  { encoding: 'utf8' },
);
if (meta.status === 0) {
  currentSha = JSON.parse(meta.stdout).sha;
}

const putArgs = [
  'api',
  '--method',
  'PUT',
  `repos/${RELEASES_REPO}/contents/update-manifest.json`,
  '-f',
  `message=Publish ${tag} update manifest`,
  '-f',
  `content=${Buffer.from(manifestBody).toString('base64')}`,
];
if (currentSha) {
  putArgs.push('-f', `sha=${currentSha}`);
}
run('gh', putArgs);

console.log(`Published ${tag}`);
console.log(`APK ${apkUrl}`);
console.log(`Manifest https://raw.githubusercontent.com/${RELEASES_REPO}/main/update-manifest.json`);
console.log(`sha256 ${sha256}`);
