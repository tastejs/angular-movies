export type RouterParams = {
  layout: 'list' | 'detail',
  type: 'person' | 'movie' | 'genre' | 'category' | 'search';
  identifier: string;
};
