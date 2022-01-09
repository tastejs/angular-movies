import { TMDBPaginateOptions } from './paginate.interface';

export function getTMDBPaginateOptions(
  options: TMDBPaginateOptions = {} as TMDBPaginateOptions
): TMDBPaginateOptions {
  let { page, sort_by } = options;
  page = page || 1;
  sort_by = sort_by || 'popularity.desc';
  return { sort_by, page };
}
