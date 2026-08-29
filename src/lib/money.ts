const formatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
});

const compactFormatter = new Intl.NumberFormat('en-MA', {
  maximumFractionDigits: 1,
});

export function formatMoney(centimes: number) {
  return formatter.format(centimes / 100);
}

export function formatCompactMoney(centimes: number) {
  return `${compactFormatter.format(centimes / 100)} MAD`;
}
