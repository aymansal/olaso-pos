export type CategoryId = string;

export type Category = {
  id: CategoryId;
  name: string;
  count: number;
  status: string;
  variant: 'default' | 'warning';
  image: string;
};
