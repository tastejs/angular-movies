// export type TMDBSortByFlags = 'popularity.desc';

export interface TMDBPaginateOptions extends Record<string, unknown> {
  page: number;
}

export interface TMDBPaginateResult<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
