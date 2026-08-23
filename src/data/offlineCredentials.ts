function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

export function offlineCredentialKeys(staffProfileId: string) {
  if (!staffProfileId) throw new Error('Staff profile is unavailable.');
  const encoded = toBase64(new TextEncoder().encode(staffProfileId))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
  const prefix = `identity.staff.${encoded}`;
  if (prefix.length + '.attempts'.length > 100) {
    throw new Error('Staff profile storage key is too long.');
  }
  return {
    session: `${prefix}.session`,
    pin: `${prefix}.offline_pin`,
    attempts: `${prefix}.offline_attempts`,
  };
}
