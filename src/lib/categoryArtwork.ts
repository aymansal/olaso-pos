export const DEFAULT_CATEGORY_ARTWORK_KEY = 'neutral';

export const CATEGORY_ARTWORK_OPTIONS = [
  {
    key: DEFAULT_CATEGORY_ARTWORK_KEY,
    label: 'Olaso',
    image: new URL('../../assets/category-art/neutral.webp', import.meta.url).href,
  },
  {
    key: 'coffee',
    label: 'Coffee',
    image: new URL('../../assets/category-art/coffee.webp', import.meta.url).href,
  },
  {
    key: 'tea',
    label: 'Tea & matcha',
    image: new URL('../../assets/category-art/tea.webp', import.meta.url).href,
  },
  {
    key: 'cold-drinks',
    label: 'Cold drinks',
    image: new URL('../../assets/category-art/cold-drinks.webp', import.meta.url).href,
  },
  {
    key: 'bakery',
    label: 'Bakery',
    image: new URL('../../assets/category-art/bakery.webp', import.meta.url).href,
  },
  {
    key: 'snacks-sweets',
    label: 'Snacks & sweets',
    image: new URL('../../assets/category-art/snacks-sweets.webp', import.meta.url).href,
  },
] as const;

export type CategoryArtworkKey =
  (typeof CATEGORY_ARTWORK_OPTIONS)[number]['key'];

export function categoryArtworkKey(value?: string): CategoryArtworkKey {
  return CATEGORY_ARTWORK_OPTIONS.some((option) => option.key === value)
    ? value as CategoryArtworkKey
    : DEFAULT_CATEGORY_ARTWORK_KEY;
}

export function categoryArtworkUrl(value?: string) {
  const key = categoryArtworkKey(value);
  return CATEGORY_ARTWORK_OPTIONS.find((option) => option.key === key)!.image;
}
