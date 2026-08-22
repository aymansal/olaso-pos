const MAX_FAILURES = 5;
const LOCKOUT_MS = 5 * 60_000;

export type OfflineAttempt = {
  failedCount: number;
  lockedUntilElapsedRealtime?: number;
  bootCount: number;
};

export type OfflinePinResult =
  | { kind: 'verified' }
  | { kind: 'incorrect'; attemptsRemaining: number }
  | { kind: 'locked' };

export function isServiceUnavailable(error: unknown) {
  if (error instanceof TypeError) return true;
  const message = error instanceof Error ? error.message : String(error);
  return /^(?:failed to fetch|network request failed|network error|offline|connection (?:failed|refused|reset|timed out))$/i.test(message.trim());
}

export function nextOfflinePinResult(
  attempt: OfflineAttempt | undefined,
  correct: boolean,
  clock: { elapsedRealtime: number; bootCount: number },
): { result: OfflinePinResult; attempt?: OfflineAttempt } {
  const locked = attempt?.lockedUntilElapsedRealtime !== undefined;
  if (locked) {
    if (attempt.bootCount === clock.bootCount
        && clock.elapsedRealtime < attempt.lockedUntilElapsedRealtime!) {
      return { result: { kind: 'locked' }, attempt };
    }
    if (attempt.bootCount !== clock.bootCount) {
      return {
        result: { kind: 'locked' },
        attempt: { failedCount: MAX_FAILURES, lockedUntilElapsedRealtime: clock.elapsedRealtime + LOCKOUT_MS, bootCount: clock.bootCount },
      };
    }
  }
  if (correct) return { result: { kind: 'verified' } };
  const failedCount = (attempt?.failedCount ?? 0) + 1;
  if (failedCount >= MAX_FAILURES) {
    return {
      result: { kind: 'locked' },
      attempt: { failedCount, lockedUntilElapsedRealtime: clock.elapsedRealtime + LOCKOUT_MS, bootCount: clock.bootCount },
    };
  }
  return {
    result: { kind: 'incorrect', attemptsRemaining: MAX_FAILURES - failedCount },
    attempt: { failedCount, bootCount: clock.bootCount },
  };
}
