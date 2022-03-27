export const icons = [
  'account',
  'back',
  'genre',
  'imdb',
  'play',
  'popular',
  'search',
  'top_rated',
  'upcoming',
  'website',
  'delete',
  'sad',
  'error',
];

export function iconProvider(name: string): string {
  return `/assets/svg-icons/${name}.svg`;
}
