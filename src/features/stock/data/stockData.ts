export type StockIconName = 'package' | 'drop' | 'leaf' | 'coffee';
export type StockStatus = 'Low' | 'Healthy' | 'Watch';

export const stockSummaries = [
  { icon: 'stack', value: '42', label: 'Ingredients', tone: 'green' },
  { icon: 'warning', value: '3', label: 'Low stock', tone: 'low' },
  { icon: 'currency', value: '11,850 MAD', label: 'Inventory value', tone: 'value' },
  { icon: 'trend', value: '486 MAD', label: 'Used today', tone: 'neutral' },
] as const;

export const stockItems: ReadonlyArray<{
  icon: StockIconName;
  name: string;
  unit: string;
  group: string;
  onHand: string;
  minimum: string;
  used: string;
  status: StockStatus;
  selected?: boolean;
}> = [
  {
    icon: 'package',
    name: 'Pistachio cream',
    unit: 'Tracked in kilograms',
    group: 'Food prep',
    onHand: '2.1 kg',
    minimum: '3.0 kg',
    used: '−420 g',
    status: 'Low',
    selected: true,
  },
  {
    icon: 'drop',
    name: 'Whole milk',
    unit: 'Tracked in litres',
    group: 'Dairy',
    onHand: '18.4 L',
    minimum: '12.0 L',
    used: '−6.8 L',
    status: 'Healthy',
  },
  {
    icon: 'leaf',
    name: 'Ceremonial matcha',
    unit: 'Tracked in grams',
    group: 'Tea',
    onHand: '680 g',
    minimum: '500 g',
    used: '−96 g',
    status: 'Healthy',
  },
  {
    icon: 'coffee',
    name: 'Espresso beans',
    unit: 'Tracked in kilograms',
    group: 'Coffee',
    onHand: '4.8 kg',
    minimum: '4.0 kg',
    used: '−1.2 kg',
    status: 'Watch',
  },
  {
    icon: 'drop',
    name: 'Oat milk',
    unit: 'Tracked in litres',
    group: 'Dairy',
    onHand: '6.0 L',
    minimum: '8.0 L',
    used: '−2.4 L',
    status: 'Low',
  },
];

export const linkedRecipes = [
  { icon: 'coffee', name: 'Iced Pistachio Matcha', usage: '22 g / sale' },
  { icon: 'coffee', name: 'Matcha Latte Pistachio', usage: '24 g / sale' },
  { icon: 'package', name: 'Pistachio Croissant', usage: '35 g / sale' },
] as const;

export const stockMovements = [
  { title: 'Sale deductions', time: 'Today, 11:42', amount: '−66 g', tone: 'low' },
  { title: 'Stock received', time: 'Yesterday, 18:05', amount: '+2.0 kg', tone: 'green' },
] as const;
