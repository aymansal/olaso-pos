export type Category = {
  name: string;
  count: string;
  status: string;
  variant: 'active' | 'default' | 'warning';
  image: string;
};

export const categories: Category[] = [
  {
    name: 'Coffee',
    count: '50 items',
    status: 'Available',
    variant: 'active',
    image: coffee,
  },
  {
    name: 'Tea',
    count: '20 items',
    status: 'Available',
    variant: 'default',
    image: tea,
  },
  {
    name: 'Snack',
    count: '10 items',
    status: 'Need to re-stock',
    variant: 'warning',
    image: snack,
  },
];
import coffee from '../../../../images/generated-1784305991267.png';
import snack from '../../../../images/generated-1784305874723.png';
import tea from '../../../../images/generated-1784305780745.png';
