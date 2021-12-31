import { PaginatedResult } from '../../state/typings';

export interface PaginationState<T> extends PaginatedResult<T> {
  activePage: number;
  loading: boolean;
}
