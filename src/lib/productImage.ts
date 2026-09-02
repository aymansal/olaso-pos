import americano from '../../images/pos-product-americano.webp';
import cappuccino from '../../images/pos-product-cappuccino.webp';
import caramelMac from '../../images/pos-product-caramel-mac.webp';
import coldBrew from '../../images/pos-product-cold-brew.webp';
import espresso from '../../images/pos-product-espresso.webp';
import flatWhite from '../../images/pos-product-flat-white.webp';
import icedCoffeeMilk from '../../images/pos-product-iced-coffee-milk.webp';
import latte from '../../images/pos-product-latte.webp';
import mocha from '../../images/pos-product-mocha.webp';
import { categoryArtworkUrl } from './categoryArtwork.ts';

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
  imageJpeg?: string,
) {
  if (imageJpeg?.startsWith('data:image/')) return imageJpeg;
  return imageAssetKey
    ? productImages[imageAssetKey] ?? categoryArtworkUrl(categoryArtworkKey)
    : categoryArtworkUrl(categoryArtworkKey);
}
