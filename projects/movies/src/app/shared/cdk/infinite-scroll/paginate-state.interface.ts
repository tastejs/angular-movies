import { PaginatedResult } from '../../state/typings';
import { LoadingState } from '../loading/loading-state.interface';

export type InfiniteScrollState<T extends {}> = PaginatedResult<T> &
  LoadingState<'loading'>;
export type PaginationOptions = { page: number; totalPages?: number };
