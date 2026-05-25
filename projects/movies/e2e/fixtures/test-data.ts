export const MOVIE_ID = '594767';
export const PERSON_ID = '1023139';
export const SEARCH_TERM = 'Matrix';

export const ROUTES = {
  home: '/',
  popular: '/list/category/popular',
  topRated: '/list/category/top_rated',
  upcoming: '/list/category/upcoming',
  genre28: '/list/genre/28',
  movieDetail: (id = MOVIE_ID) => `/detail/movie/${id}`,
  personDetail: (id = PERSON_ID) => `/detail/person/${id}`,
  notFound: '/page-not-found',
  myLists: '/account/my-lists',
  createList: '/account/list/create',
} as const;

export const LIST_ROUTES = [
  ROUTES.popular,
  ROUTES.topRated,
  ROUTES.upcoming,
  ROUTES.genre28,
] as const;
