import { ConvexError } from 'convex/values';
import type { QueryCtx } from '../_generated/server';

declare const process: { env: Record<string, string | undefined> };

export async function requireOperationalAccess(
  ctx: { auth: QueryCtx['auth'] },
) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity) {
    return identity.name ?? identity.email ?? identity.subject;
  }
  if (process.env.OLASO_ALLOW_DEV_POS === 'true') {
    return 'Development cashier';
  }
  throw new ConvexError({
    code: 'UNAUTHENTICATED',
    message: 'Cashier sign-in is required.',
  });
}
