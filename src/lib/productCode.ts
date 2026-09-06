// Human-readable reference only; product IDs and synchronization keys stay intact.
export function nextProductCode(name: string, usedCodes: readonly string[]) {
  const prefix = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3).padEnd(3, 'X');
  const used = new Set(usedCodes);
  for (let n = 1; n <= 999; n += 1) {
    const code = `${prefix}-${String(n).padStart(3, '0')}`;
    if (!used.has(code)) return code;
  }
  throw new Error('Product code range is full.');
}
