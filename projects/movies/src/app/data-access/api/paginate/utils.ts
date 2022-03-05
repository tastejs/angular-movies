import { TMDBPaginateOptions } from './paginate.interface';

export function getTMDBPaginateOptions(
  options: TMDBPaginateOptions = {} as TMDBPaginateOptions
): TMDBPaginateOptions {
  let { page } = options;
  page = page || 1;
  return { page };
}
