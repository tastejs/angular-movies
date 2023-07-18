export type TBDMSortByDirections = 'asc' | 'desc';
export type TBDMSortByTypes =
  | 'popularity'
  | 'release_date'
  | 'revenue'
  | 'primary_release_date'
  | 'original_title'
  | 'vote_average'
  | 'vote_count';
export type TBDMSortByValues = `${TBDMSortByTypes}.${TBDMSortByDirections}`;

export interface TMDBSortOptions extends Record<string, unknown> {
  sort_by?: TBDMSortByValues;
}
