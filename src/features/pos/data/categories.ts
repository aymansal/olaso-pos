import coffee from '../../../../images/generated-1784305991267.png';
import snack from '../../../../images/generated-1784305874723.png';
import tea from '../../../../images/generated-1784305780745.png';

export type CategoryId = string;

export type Category = {
  id: CategoryId;
  name: string;
  count: number;
  status: string;
  variant: 'default' | 'warning';
  image: string;
};

export function categoryImage(key: string) {
  if (key === 'coffee') return coffee;
  if (key === 'matcha-tea') return tea;
  return snack;
}
