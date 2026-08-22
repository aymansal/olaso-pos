import type { QueryCtx } from '../_generated/server';
import { requireStaffSession } from './session';

export async function requireOperationalAccess(
  ctx: Pick<QueryCtx, 'db'>,
  args: { sessionToken: string; deviceId: string },
) {
  return (await requireStaffSession(ctx, args)).name;
}
