import { CategoryNames, GenreIds } from '../internals/typings';

export const sideMenuBtnSelector = '*[data-test="menu-btn"]';

export const categorySelector = (c: CategoryNames): string =>
  `*[data-test="menu-cat-${c}"]`;

export const genreSelector = (g: GenreIds): string =>
  `*[data-test="menu-gen-${g}"]`;
