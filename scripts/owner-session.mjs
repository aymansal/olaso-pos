import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { api } from '../convex/_generated/api.js';

export async function ownerSession(client, root, deviceId) {
  const pin = process.env.OLASO_OWNER_PIN;
  assert(/^\d{6}$/.test(pin ?? ''), 'OLASO_OWNER_PIN must be a six-digit test restore PIN');
  const seeded = JSON.parse(execSync('npx convex run seed:verify', {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }));
  const recoveryCode = execSync('npx convex env get OLASO_SUPPORT_RECOVERY_CODE', {
    cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  await client.action(api.identity.supportSetPin, {
    staffProfileId: seeded.ownerProfileId, pin, recoveryCode,
  });
  const owner = await client.action(api.identity.signIn, {
    staffProfileId: seeded.ownerProfileId, pin, deviceId,
  });
  assert.equal(owner.kind, 'authenticated');
  return { sessionToken: owner.token, deviceId };
}
