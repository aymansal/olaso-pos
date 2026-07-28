export const productCategories = [
  { icon: 'all', name: 'All products', count: '73 products', active: false },
  { icon: 'coffee', name: 'Coffee', count: '17 products', active: false },
  { icon: 'leaf', name: 'Matcha & Hojicha', count: '27 products', active: true },
  { icon: 'snowflake', name: 'Cold & Blended', count: '18 products', active: false },
  { icon: 'package', name: 'Bakery & Desserts', count: '11 products', active: false },
] as const;

export const products = [
  { icon: 'leaf', name: 'Iced Pistachio Matcha', code: 'MTC-014', price: '42 MAD' },
  { icon: 'leaf', name: 'Iced Spanish Matcha', code: 'MTC-012', price: '39 MAD' },
  { icon: 'leaf', name: 'Iced Vanilla Matcha', code: 'MTC-010', price: '35 MAD' },
  { icon: 'leaf', name: 'Ceremonial Matcha', code: 'MTC-021', price: '40 MAD' },
  { icon: 'coffee', name: 'Hojicha Latte', code: 'HJC-004', price: '32 MAD' },
  { icon: 'leaf', name: 'Iced Ube Latte', code: 'UBE-007', price: '42 MAD' },
] as const;

export const productOptions = [
  { icon: 'ruler', name: 'Standard', value: '42 MAD' },
  { icon: 'plus', name: 'Plus size', value: '+20 MAD' },
  { icon: 'drop', name: 'Milk types', value: '5 choices' },
] as const;
