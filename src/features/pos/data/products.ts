import type { CategoryId } from './categories';

export type Product = {
  id: string;
  categoryId: CategoryId;
  name: string;
  priceCentimes: number;
  image: string;
};

export const products: Product[] = [
  { id: 'espresso', categoryId: 'coffee', name: 'Espresso', priceCentimes: 1000, image: espresso },
  { id: 'cappuccino', categoryId: 'coffee', name: 'Cappuccino', priceCentimes: 1700, image: cappuccino },
  { id: 'latte', categoryId: 'coffee', name: 'Latte', priceCentimes: 1800, image: latte },
  { id: 'americano', categoryId: 'coffee', name: 'Americano', priceCentimes: 1300, image: americano },
  { id: 'mocha', categoryId: 'coffee', name: 'Mocha', priceCentimes: 2600, image: mocha },
  { id: 'iced-coffee-milk', categoryId: 'coffee', name: 'Iced Coffee Milk', priceCentimes: 2200, image: icedCoffeeMilk },
  { id: 'cold-brew', categoryId: 'coffee', name: 'Cold Brew', priceCentimes: 1800, image: coldBrew },
  { id: 'flat-white', categoryId: 'coffee', name: 'Flat White', priceCentimes: 1800, image: flatWhite },
  { id: 'caramel-mac', categoryId: 'coffee', name: 'Caramel Mac', priceCentimes: 2700, image: caramelMac },
  { id: 'salted-caramel', categoryId: 'coffee', name: 'Salted Caramel', priceCentimes: 2900, image: saltedCaramel },
  { id: 'hazelnut-latte', categoryId: 'coffee', name: 'Hazelnut Latte', priceCentimes: 2300, image: hazelnutLatte },
  { id: 'pour-over', categoryId: 'coffee', name: 'Pour Over', priceCentimes: 4500, image: pourOver },
];

export const americanoOrderImage = americanoOrder;
import americanoOrder from '../../../../images/generated-1784303397627.png';
import americano from '../../../../images/generated-1784303398691.png';
import cappuccino from '../../../../images/generated-1784303397619.png';
import caramelMac from '../../../../images/generated-1784303398948.png';
import coldBrew from '../../../../images/generated-1784303397988.png';
import espresso from '../../../../images/generated-1784303398789.png';
import flatWhite from '../../../../images/generated-1784303397633.png';
import hazelnutLatte from '../../../../images/generated-1784303398701.png';
import icedCoffeeMilk from '../../../../images/generated-1784303399328.png';
import latte from '../../../../images/generated-1784303397938.png';
import mocha from '../../../../images/generated-1784303398686.png';
import pourOver from '../../../../images/generated-1784303398638.png';
import saltedCaramel from '../../../../images/generated-1784303397863.png';
