import { ConvexError } from 'convex/values';
import type { QueryCtx } from '../_generated/server';

declare const process: { env: Record<string, string | undefined> };

type ManagementContext = { auth: QueryCtx['auth'] };

function fail(
  code:
    | 'UNAUTHENTICATED'
    | 'FORBIDDEN'
    | 'INVALID_ARGUMENT'
    | 'CONFLICT'
    | 'NOT_FOUND',
  message: string,
): never {
  throw new ConvexError({ code, message });
}

export async function requireManagement(ctx: ManagementContext) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    if (process.env.OLASO_ALLOW_DEV_MANAGEMENT === 'true') {
      return 'Development manager';
    }
    return fail('UNAUTHENTICATED', 'Management sign-in is required.');
  }

  const role = typeof identity.role === 'string' ? identity.role : null;
  if (role !== 'owner' && role !== 'manager') {
    return fail('FORBIDDEN', 'Owner or manager access is required.');
  }

  return identity.name ?? identity.email ?? identity.subject;
}

export async function requireOwner(ctx: ManagementContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    if (process.env.OLASO_ALLOW_DEV_MANAGEMENT === 'true') {
      return 'Development owner';
    }
    return fail('UNAUTHENTICATED', 'Owner sign-in is required.');
  }
  if (identity.role !== 'owner') {
    return fail('FORBIDDEN', 'Owner access is required.');
  }
  return identity.name ?? identity.email ?? identity.subject;
}

export function cleanText(value: string, label: string, maxLength: number) {
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) {
    return fail(
      'INVALID_ARGUMENT',
      `${label} must contain 1 to ${maxLength} characters.`,
    );
  }
  return cleaned;
}

export function cleanOptionalText(
  value: string | undefined,
  label: string,
  maxLength: number,
) {
  if (value === undefined || value.trim() === '') return undefined;
  return cleanText(value, label, maxLength);
}

export function cleanKey(value: string | undefined, label: string) {
  if (
    !value ||
    value.length > 80 ||
    value !== value.trim().toLowerCase() ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  ) {
    return fail(
      'INVALID_ARGUMENT',
      `${label} must use lowercase letters, numbers, and single hyphens.`,
    );
  }
  return value;
}

export function boundedInteger(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    return fail(
      'INVALID_ARGUMENT',
      `${label} must be an integer from ${minimum} to ${maximum}.`,
    );
  }
  return value;
}

export function businessDate(value: string) {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
    || !Number.isFinite(parsed)
    || new Date(parsed).toISOString().slice(0, 10) !== value
  ) {
    return fail(
      'INVALID_ARGUMENT',
      'Business date must use YYYY-MM-DD.',
    );
  }
  return value;
}

export function mutationId(value: string) {
  if (
    value.length < 8 ||
    value.length > 128 ||
    !/^[A-Za-z0-9._:-]+$/.test(value)
  ) {
    return fail('INVALID_ARGUMENT', 'Invalid client mutation identifier.');
  }
  return value;
}

export function expectRevision(
  expected: number | undefined,
  actual: number,
) {
  if (expected === undefined || expected !== actual) {
    return fail(
      'CONFLICT',
      'This record changed after it was loaded. Reload it and try again.',
    );
  }
}

export function notFound(label: string): never {
  return fail('NOT_FOUND', `${label} was not found.`);
}

export function conflict(message: string): never {
  return fail('CONFLICT', message);
}

export function invalid(message: string): never {
  return fail('INVALID_ARGUMENT', message);
}
