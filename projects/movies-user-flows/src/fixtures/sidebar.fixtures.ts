import { CategoryNames, GenreIds } from '../internals/typings';

export const sideMenuBtnSelector = '*[data-test="sidebar--main-btn"]';

export const categorySelector = (c: CategoryNames): string =>
  `*[data-test="sidebar--link--category-${c}"]`;

export const genreSelector = (g: GenreIds): string =>
  `*[data-test="sidebar--link--genre-${g}"]`;
