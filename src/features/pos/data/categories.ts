export type CategoryId = 'coffee' | 'tea' | 'snack';

export type Category = {
  id: CategoryId;
  name: string;
  count: number;
  status: string;
  variant: 'default' | 'warning';
  image: string;
};

export const categories: Category[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    count: 50,
    status: 'Available',
    variant: 'default',
    image: coffee,
  },
  {
    id: 'tea',
    name: 'Tea',
    count: 20,
    status: 'Available',
    variant: 'default',
    image: tea,
  },
  {
    id: 'snack',
    name: 'Snack',
    count: 10,
    status: 'Need to re-stock',
    variant: 'warning',
    image: snack,
  },
];
import coffee from '../../../../images/generated-1784305991267.png';
import snack from '../../../../images/generated-1784305874723.png';
import tea from '../../../../images/generated-1784305780745.png';
