import { TBDMSortByValues } from '../../data-access/api/sort/sort.interface';

export type RouterParams = {
  layout: 'list' | 'detail';
  type: 'person' | 'movie' | 'genre' | 'category' | 'search' | 'list';
  identifier: string;
  sortBy?: TBDMSortByValues;
};
