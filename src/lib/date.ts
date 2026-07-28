const DAY_MS = 86_400_000;

export function localBusinessDate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftBusinessDate(value: string, days: number) {
  return new Date(
    Date.parse(`${value}T00:00:00.000Z`) + days * DAY_MS,
  ).toISOString().slice(0, 10);
}
