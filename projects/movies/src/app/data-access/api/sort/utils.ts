import { TMDBSortOptions } from './sort.interface';

export function getTMDBSortOptions(
  options: TMDBSortOptions = {} as TMDBSortOptions
): TMDBSortOptions {
  let { sort_by } = options;
  sort_by = sort_by || 'popularity.desc';
  return { sort_by };
}
