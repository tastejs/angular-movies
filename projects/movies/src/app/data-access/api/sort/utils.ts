import { TMDBSortOptions } from './sort.interface';

export function getTMDBSortOptions(
  options: TMDBSortOptions = {} as TMDBSortOptions
): TMDBSortOptions {
  return { sort_by: options.sort_by || 'popularity.desc' };
}
