export const hourlySales = [
  { hour: '09', height: 38, tone: 1 },
  { hour: '10', height: 56, tone: 1 },
  { hour: '11', height: 72, tone: 2 },
  { hour: '12', height: 96, tone: 3 },
  { hour: '13', height: 118, tone: 4 },
  { hour: '14', height: 142, tone: 5 },
  { hour: '15', height: 126, tone: 6 },
  { hour: '16', height: 158, tone: 7 },
  { hour: '17', height: 184, tone: 8 },
  { hour: '18', height: 206, tone: 10 },
  { hour: '19', height: 192, tone: 9 },
  { hour: '20', height: 146, tone: 7 },
] as const;

export const stockItems = [
  {
    icon: 'leaf',
    name: 'Ceremonial Matcha',
    remaining: '420 g left',
    status: '14 cups',
    tone: 'danger',
  },
  {
    icon: 'drop',
    name: 'Whole Milk',
    remaining: '8.4 L left',
    status: 'Low',
    tone: 'gold',
  },
  {
    icon: 'flask',
    name: 'Pistachio Syrup',
    remaining: '1.2 L left',
    status: 'Soon',
    tone: 'green',
  },
  {
    icon: 'package',
    name: 'Croissant Dough',
    remaining: '18 pieces',
    status: 'Today',
    tone: 'green',
  },
] as const;

export const recentOrders = [
  { number: '#27362', meta: 'Dine in · 3 items', amount: '164 MAD', time: '10:42' },
  { number: '#27361', meta: 'Take away · 2 items', amount: '92 MAD', time: '10:38' },
  { number: '#27360', meta: 'Dine in · 1 item', amount: '45 MAD', time: '10:34' },
  { number: '#27359', meta: 'Dine in · 4 items', amount: '218 MAD', time: '10:29' },
] as const;
