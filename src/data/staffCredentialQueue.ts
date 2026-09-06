// Serialize credential changes, sign-in and authenticated snapshot cleanup
// through their acknowledgements, not merely the native protected-store write.
let tail: Promise<unknown> = Promise.resolve();

export function withStaffCredentialLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = tail.then(operation, operation);
  tail = result.catch(() => undefined);
  return result;
}
