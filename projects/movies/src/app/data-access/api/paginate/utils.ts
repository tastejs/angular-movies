import { TMDBPaginateOptions } from './paginate.interface';

export function getTMDBPaginateOptions(
  options: TMDBPaginateOptions = {} as TMDBPaginateOptions
): TMDBPaginateOptions {
  return { page: options.page || 1 };
}
