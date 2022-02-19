import { TBDMSortByValues } from './sort.interface';

export type MoviesSortValue = {
  name: string;
  value: TBDMSortByValues;
};

export const SORT_VALUES: MoviesSortValue[] = [
  {
    name: 'Popularity',
    value: 'popularity.desc',
  },
  {
    name: 'Votes Average',
    value: 'vote_average.desc',
  },
  {
    name: 'Original Title',
    value: 'original_title.desc',
  },
  {
    name: 'Release Date',
    value: 'release_date.desc',
  },
];
