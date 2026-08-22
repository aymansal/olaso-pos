import { ConvexError, v } from 'convex/values';
import type { QueryCtx } from '../_generated/server';

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,100}$/;
const DEVICE_PATTERN = /^[A-Za-z0-9._-]{1,120}$/;

export const sessionArgs = {
  sessionToken: v.string(),
  deviceId: v.string(),
};

type SessionContext = Pick<QueryCtx, 'db'>;

export type ActiveStaffSession = {
  staffProfileId: string;
  name: string;
  role: 'owner' | 'manager' | 'cashier' | 'worker';
};

function unavailable(): never {
  throw new ConvexError({
    code: 'UNAUTHENTICATED',
    message: 'Staff session is unavailable. Sign in again.',
  });
}

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(token),
  );
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

export async function requireStaffSession(
  ctx: SessionContext,
  args: { sessionToken: string; deviceId: string },
): Promise<ActiveStaffSession> {
  if (!TOKEN_PATTERN.test(args.sessionToken) || !DEVICE_PATTERN.test(args.deviceId)) {
    return unavailable();
  }
  const hashedToken = await tokenHash(args.sessionToken);
  const session = await ctx.db
    .query('staffSessions')
    .withIndex('by_token_hash', (index) =>
      index.eq('tokenHash', hashedToken),
    )
    .unique();
  if (!session || session.deviceId !== args.deviceId || session.revokedAt) {
    return unavailable();
  }
  const [staff, identity] = await Promise.all([
    ctx.db.get(session.staffProfileId),
    ctx.db
      .query('staffIdentities')
      .withIndex('by_staff_profile', (index) =>
        index.eq('staffProfileId', session.staffProfileId),
      )
      .unique(),
  ]);
  if (!staff || staff.status !== 'active' || !identity
      || identity.credentialVersion !== session.credentialVersion) {
    return unavailable();
  }
  return { staffProfileId: String(staff._id), name: staff.name, role: staff.role };
}
