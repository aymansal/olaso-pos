import { Coffee, Drop, Leaf, Package } from '@phosphor-icons/react';
export type StockIconName = 'package' | 'drop' | 'leaf' | 'coffee';

interface StockIconProps {
  name: StockIconName;
  size: number;
}

export function StockIcon({ name, size }: StockIconProps) {
  if (name === 'coffee') return <Coffee size={size} aria-hidden="true" />;
  if (name === 'drop') return <Drop size={size} aria-hidden="true" />;
  if (name === 'leaf') return <Leaf size={size} aria-hidden="true" />;
  return <Package size={size} aria-hidden="true" />;
}
