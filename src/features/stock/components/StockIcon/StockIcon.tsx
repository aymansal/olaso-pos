import { Coffee, WaterDrop, Leaf, Package } from '@boxicons/react';
export type StockIconName = 'package' | 'drop' | 'leaf' | 'coffee';

interface StockIconProps {
  name: StockIconName;
  size: number;
}

export function StockIcon({ name, size }: StockIconProps) {
  if (name === 'coffee') return <Coffee width={size} height={size} aria-hidden="true" />;
  if (name === 'drop') return <WaterDrop width={size} height={size} aria-hidden="true" />;
  if (name === 'leaf') return <Leaf width={size} height={size} aria-hidden="true" />;
  return <Package width={size} height={size} aria-hidden="true" />;
}
