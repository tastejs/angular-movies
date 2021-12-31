export type TMDBSortByFlags = 'popularity.desc';

export interface TMDBPaginationOptions extends Record<string, any> {
  page: number;
  sort_by?: string
}

export interface TMDBPaginatedResult<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number
}



