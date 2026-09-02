import type { CategoryId } from './categories';

export type Product = {
  id: string;
  categoryId: CategoryId;
  name: string;
  priceCentimes: number;
  image: string;
};
