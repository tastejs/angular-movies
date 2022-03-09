import { CategoryNames, GenreIds } from '../internals/typings';

export const sideMenuBtnSelector = '*[data-uf="menu-btn"]';

export const categorySelector = (c: CategoryNames): string => {
  return `*[data-uf="menu-cat-${c}"]`;
};

export const genreSelector = (g: GenreIds): string => {
  return `*[data-uf="menu-gen-${g}"]`;
};
