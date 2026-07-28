export const reportKpis = [
  { icon: 'currency', value: '126,420 MAD', label: 'Net sales', change: '+11.8%', tone: 'up' },
  { icon: 'receipt', value: '1,842', label: 'Orders', change: '+8.4%', tone: 'up' },
  { icon: 'calculator', value: '68.6 MAD', label: 'Average order', change: '+3.1%', tone: 'up' },
  { icon: 'bag', value: '4,916', label: 'Items sold', change: '−2.0%', tone: 'down' },
] as const;

export const salesBars = [
  { day: '01', height: 54, peak: false },
  { day: '03', height: 72, peak: false },
  { day: '05', height: 64, peak: false },
  { day: '07', height: 86, peak: false },
  { day: '09', height: 76, peak: false },
  { day: '11', height: 96, peak: false },
  { day: '13', height: 70, peak: false },
  { day: '15', height: 82, peak: false },
  { day: '17', height: 112, peak: false },
  { day: '19', height: 98, peak: false },
  { day: '21', height: 122, peak: true },
  { day: '23', height: 106, peak: false },
] as const;

export const topProducts = [
  {
    name: 'Iced Pistachio Matcha',
    category: 'Matcha & Hojicha',
    quantity: '604',
    sales: '25,368 MAD',
    share: '20.1%',
    selected: true,
  },
  {
    name: 'Pistachio Kunefe Croissant',
    category: 'Bakery & Desserts',
    quantity: '388',
    sales: '12,416 MAD',
    share: '9.8%',
    selected: false,
  },
  {
    name: 'Frappe Signature Coffee',
    category: 'Cold & Blended',
    quantity: '342',
    sales: '11,970 MAD',
    share: '9.5%',
    selected: false,
  },
] as const;

export const salesCategories = [
  { name: 'Matcha & Hojicha', amount: '58,153 MAD', share: '46%', width: 292, tone: 'primary' },
  { name: 'Coffee', amount: '39,190 MAD', share: '31%', width: 197, tone: 'coffee' },
  { name: 'Cold & Blended', amount: '18,963 MAD', share: '15%', width: 95, tone: 'cold' },
  { name: 'Bakery & Desserts', amount: '10,114 MAD', share: '8%', width: 51, tone: 'bakery' },
] as const;

export const paymentMethods = [
  { name: 'Cash', share: '62%', tone: 'cash' },
  { name: 'Card', share: '26%', tone: 'card' },
  { name: 'Online', share: '12%', tone: 'online' },
] as const;

export const stockConsumed = [
  { icon: 'drop', name: 'Whole milk', value: '182.4 L' },
  { icon: 'coffee', name: 'Espresso beans', value: '24.6 kg' },
  { icon: 'leaf', name: 'Ceremonial matcha', value: '12.8 kg' },
] as const;
