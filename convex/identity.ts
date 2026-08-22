import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { isStaffRole, type StaffRole } from './lib/permissions';

const PIN_PATTERN = /^\d{6}$/;
const DEVICE_PATTERN = /^[A-Za-z0-9._-]{1,120}$/;
const PIN_ITERATIONS = 600_000;
declare const process: { env: Record<string, string | undefined> };
type SignInRecord = {
  staffProfileId: Id<'staffProfiles'>;
  role: StaffRole;
  pinSalt: string;
  pinHash: string;
  credentialVersion: number;
  failedCount: number;
  lockedUntil?: number;
};
type StaffIdentity = {
  staffProfileId: Id<'staffProfiles'>;
  name: string;
  role: StaffRole;
};
type SignInResult = StaffIdentity & { kind: 'authenticated'; token: string };
type SignInFailure = { kind: 'invalid-pin' | 'locked' };

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function pinHash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(salt), iterations: PIN_ITERATIONS },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return toBase64(new Uint8Array(digest));
}

function equal(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64(bytes).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function createSalt() {
  return toBase64(crypto.getRandomValues(new Uint8Array(16)));
}

function assertSupportCode(value: string) {
  const expected = process.env.OLASO_SUPPORT_RECOVERY_CODE;
  if (!expected || !equal(value, expected)) {
    throw new Error('Support recovery is unavailable.');
  }
}

export const signIn = action({
  args: { staffProfileId: v.id('staffProfiles'), pin: v.string(), deviceId: v.string() },
  handler: async (ctx, args): Promise<SignInResult | SignInFailure> => {
    if (!PIN_PATTERN.test(args.pin) || !DEVICE_PATTERN.test(args.deviceId)) {
      throw new Error('Sign-in details are invalid.');
    }
    const now = Date.now();
    const record = await ctx.runQuery(internal.identityInternal.getSignInRecord, {
      staffProfileId: args.staffProfileId,
      deviceId: args.deviceId,
    }) as SignInRecord | null;
    if (!record) {
      throw new Error('Sign-in is temporarily unavailable.');
    }
    if (record.lockedUntil && record.lockedUntil > now) return { kind: 'locked' };
    if (!isStaffRole(record.role)) {
      throw new Error('Staff access requires an owner role update.');
    }
    const candidate = await pinHash(args.pin, record.pinSalt);
    if (!equal(candidate, record.pinHash)) {
      const failure = await ctx.runMutation(internal.identityInternal.recordFailedAttempt, {
        staffProfileId: args.staffProfileId,
        deviceId: args.deviceId,
        now,
      });
      return { kind: failure.lockedUntil ? 'locked' : 'invalid-pin' };
    }
    const token = createToken();
    const staff = await ctx.runMutation(internal.identityInternal.createSession, {
      staffProfileId: args.staffProfileId,
      deviceId: args.deviceId,
      credentialVersion: record.credentialVersion,
      tokenHash: await tokenHash(token),
      now,
    }) as StaffIdentity;
    return { kind: 'authenticated', token, ...staff };
  },
});

export const supportSetPin = action({
  args: {
    staffProfileId: v.id('staffProfiles'),
    pin: v.string(),
    recoveryCode: v.string(),
  },
  handler: async (ctx, args): Promise<StaffIdentity> => {
    if (!PIN_PATTERN.test(args.pin)) throw new Error('PIN must contain six digits.');
    assertSupportCode(args.recoveryCode);
    const pinSalt = createSalt();
    return await ctx.runMutation(internal.identityInternal.replaceCredential, {
      staffProfileId: args.staffProfileId,
      pinSalt,
      pinHash: await pinHash(args.pin, pinSalt),
      now: Date.now(),
    }) as StaffIdentity;
  },
});

export const validateSession = action({
  args: { token: v.string(), deviceId: v.string() },
  handler: async (ctx, args): Promise<StaffIdentity> => {
    if (!/^[A-Za-z0-9_-]{40,100}$/.test(args.token) || !DEVICE_PATTERN.test(args.deviceId)) {
      throw new Error('Session details are invalid.');
    }
    const session = await ctx.runQuery(internal.identityInternal.validateSession, {
      tokenHash: await tokenHash(args.token),
      deviceId: args.deviceId,
    }) as StaffIdentity | null;
    if (!session) throw new Error('Staff session is unavailable. Sign in again.');
    return session;
  },
});
