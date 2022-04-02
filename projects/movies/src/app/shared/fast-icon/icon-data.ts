export function iconProvider(name: string): string {
  return `/assets/svg-icons/${name}.svg`;
}

export const SUPPORTED_ICONS = [
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
] as const;
export type SupportedIcons = typeof SUPPORTED_ICONS[number];
