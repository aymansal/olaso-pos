import type { QueryCtx } from '../_generated/server';
import { requireStaffSession } from './session';
import { hasPermission } from './permissions';
import { ConvexError } from 'convex/values';

export async function requireOperationalAccess(
  ctx: Pick<QueryCtx, 'db'>,
  args: { sessionToken: string; deviceId: string },
) {
  return (await requireOperationalSession(ctx, args)).name;
}

export async function requireOperationalSession(
  ctx: Pick<QueryCtx, 'db'>,
  args: { sessionToken: string; deviceId: string },
) {
  const session = await requireStaffSession(ctx, args);
  if (!hasPermission(session.role, 'pos')) {
    throw new ConvexError({
      code: 'FORBIDDEN',
      message: 'Your staff role cannot perform POS operations.',
    });
  }
  return session;
}
