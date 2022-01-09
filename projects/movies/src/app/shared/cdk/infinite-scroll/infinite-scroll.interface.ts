import {
  TMDBPaginateOptions,
  TMDBPaginateResult,
} from '../../../data-access/api/paginate/paginate.interface';
import { WithContext } from '../context/context.interface';

export type InfiniteScrollState<T extends {}> = TMDBPaginateResult<T> &
  WithContext<TMDBPaginateResult<T>>;
export type InfiniteScrollOptions = TMDBPaginateOptions;
export type InfiniteScrollResult<T> = TMDBPaginateResult<T>;
