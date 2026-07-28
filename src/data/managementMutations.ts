export function keyFromName(name: string, fallback: string) {
  const key = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return key || fallback;
}

export function newMutationId() {
  return crypto.randomUUID();
}
