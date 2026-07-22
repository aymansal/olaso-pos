export type Product = {
  name: string;
  price: string;
  image: string;
};

export const products: Product[] = [
  { name: 'Espresso', price: '$4.2', image: espresso },
  { name: 'Cappuccino', price: '$3.3', image: cappuccino },
  { name: 'Latte', price: '$4.0', image: latte },
  { name: 'Americano', price: '$4.0', image: americano },
  { name: 'Mocha', price: '$4.0', image: mocha },
  { name: 'Iced Coffee Milk', price: '$3.8', image: icedCoffeeMilk },
  { name: 'Cold Brew', price: '$4.0', image: coldBrew },
  { name: 'Flat White', price: '$3.8', image: flatWhite },
  { name: 'Caramel Mac', price: '$4.0', image: caramelMac },
  { name: 'Salted Caramel', price: '$4.2', image: saltedCaramel },
  { name: 'Hazelnut Latte', price: '$4.0', image: hazelnutLatte },
  { name: 'Pour Over', price: '$4.0', image: pourOver },
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
