import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

const ACTIVE = 'active' as const;
const MAX_FAILURES = 5;
const LOCKOUT_MS = 5 * 60_000;

export const getSignInRecord = internalQuery({
  args: { staffProfileId: v.id('staffProfiles'), deviceId: v.string() },
  handler: async (ctx, args) => {
    const staff = await ctx.db.get(args.staffProfileId);
    if (!staff || staff.status !== ACTIVE) return null;
    const identity = await ctx.db
      .query('staffIdentities')
      .withIndex('by_staff_profile', (index) =>
        index.eq('staffProfileId', args.staffProfileId),
      )
      .unique();
    if (!identity) return null;
    const attempt = await ctx.db
      .query('staffPinAttempts')
      .withIndex('by_staff_device', (index) =>
        index.eq('staffProfileId', args.staffProfileId).eq('deviceId', args.deviceId),
      )
      .unique();
    return {
      staffProfileId: staff._id,
      role: staff.role,
      pinSalt: identity.pinSalt,
      pinHash: identity.pinHash,
      credentialVersion: identity.credentialVersion,
      failedCount: attempt?.failedCount ?? 0,
      lockedUntil: attempt?.lockedUntil,
    };
  },
});

export const recordFailedAttempt = internalMutation({
  args: { staffProfileId: v.id('staffProfiles'), deviceId: v.string(), now: v.number() },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query('staffPinAttempts')
      .withIndex('by_staff_device', (index) =>
        index.eq('staffProfileId', args.staffProfileId).eq('deviceId', args.deviceId),
      )
      .unique();
    const failedCount = (current?.failedCount ?? 0) + 1;
    const lockedUntil = failedCount >= MAX_FAILURES ? args.now + LOCKOUT_MS : undefined;
    if (current) {
      await ctx.db.patch(current._id, { failedCount, lockedUntil, updatedAt: args.now });
    } else {
      await ctx.db.insert('staffPinAttempts', {
        staffProfileId: args.staffProfileId,
        deviceId: args.deviceId,
        failedCount,
        ...(lockedUntil ? { lockedUntil } : {}),
        updatedAt: args.now,
      });
    }
    return { lockedUntil };
  },
});

export const createSession = internalMutation({
  args: {
    staffProfileId: v.id('staffProfiles'),
    deviceId: v.string(),
    credentialVersion: v.number(),
    tokenHash: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const staff = await ctx.db.get(args.staffProfileId);
    const identity = await ctx.db
      .query('staffIdentities')
      .withIndex('by_staff_profile', (index) =>
        index.eq('staffProfileId', args.staffProfileId),
      )
      .unique();
    if (!staff || staff.status !== ACTIVE || !identity
        || identity.credentialVersion !== args.credentialVersion) {
      throw new Error('Staff access is unavailable.');
    }
    const previous = await ctx.db
      .query('staffPinAttempts')
      .withIndex('by_staff_device', (index) =>
        index.eq('staffProfileId', args.staffProfileId).eq('deviceId', args.deviceId),
      )
      .unique();
    if (previous) {
      await ctx.db.patch(previous._id, {
        failedCount: 0,
        lockedUntil: undefined,
        updatedAt: args.now,
      });
    }
    await ctx.db.insert('staffSessions', {
      tokenHash: args.tokenHash,
      staffProfileId: args.staffProfileId,
      deviceId: args.deviceId,
      credentialVersion: args.credentialVersion,
      createdAt: args.now,
      lastSeenAt: args.now,
    });
    return { staffProfileId: staff._id, name: staff.name, role: staff.role };
  },
});

export const replaceCredential = internalMutation({
  args: {
    staffProfileId: v.id('staffProfiles'),
    pinSalt: v.string(),
    pinHash: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const staff = await ctx.db.get(args.staffProfileId);
    if (!staff || staff.status !== ACTIVE) throw new Error('Staff access is unavailable.');
    const existing = await ctx.db
      .query('staffIdentities')
      .withIndex('by_staff_profile', (index) =>
        index.eq('staffProfileId', args.staffProfileId),
      )
      .unique();
    const credentialVersion = (existing?.credentialVersion ?? 0) + 1;
    if (existing) {
      await ctx.db.patch(existing._id, {
        pinSalt: args.pinSalt,
        pinHash: args.pinHash,
        credentialVersion,
        updatedAt: args.now,
      });
    } else {
      await ctx.db.insert('staffIdentities', {
        staffProfileId: args.staffProfileId,
        pinSalt: args.pinSalt,
        pinHash: args.pinHash,
        credentialVersion,
        updatedAt: args.now,
      });
    }
    const sessions = await ctx.db
      .query('staffSessions')
      .withIndex('by_staff_profile', (index) =>
        index.eq('staffProfileId', args.staffProfileId),
      )
      .take(101);
    if (sessions.length > 100) throw new Error('Staff session limit exceeded.');
    await Promise.all(sessions.map((session) =>
      session.revokedAt ? undefined : ctx.db.patch(session._id, { revokedAt: args.now }),
    ));
    return { staffProfileId: staff._id, name: staff.name, role: staff.role };
  },
});
