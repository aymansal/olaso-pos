const formatter = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
});

export function formatMoney(centimes: number) {
  return formatter.format(centimes / 100);
}
