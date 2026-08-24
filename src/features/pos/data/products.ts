import americano from '../../../../images/generated-1784303398691.png';
import cappuccino from '../../../../images/generated-1784303397619.png';
import caramelMac from '../../../../images/generated-1784303398948.png';
import coldBrew from '../../../../images/generated-1784303397988.png';
import espresso from '../../../../images/generated-1784303398789.png';
import flatWhite from '../../../../images/generated-1784303397633.png';
import icedCoffeeMilk from '../../../../images/generated-1784303399328.png';
import latte from '../../../../images/generated-1784303397938.png';
import mocha from '../../../../images/generated-1784303398686.png';
import type { CategoryId } from './categories';
import { categoryArtworkUrl } from '../../../lib/categoryArtwork.ts';

export type Product = {
  id: string;
  categoryId: CategoryId;
  name: string;
  priceCentimes: number;
  image: string;
};

const productImages: Record<string, string> = {
  americano,
  cappuccino,
  'caramel-mac': caramelMac,
  'cold-brew': coldBrew,
  espresso,
  'flat-white': flatWhite,
  'iced-coffee-milk': icedCoffeeMilk,
  latte,
  mocha,
};

export function productImage(
  imageAssetKey: string | undefined,
  categoryArtworkKey: string | undefined,
) {
  return imageAssetKey
    ? productImages[imageAssetKey] ?? categoryArtworkUrl(categoryArtworkKey)
    : categoryArtworkUrl(categoryArtworkKey);
}
