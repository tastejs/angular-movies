export interface PaginatedResult<T> {
  page: number;
  totalResults: number;
  totalPages: number;
  results: T[];
}
