export const sideMenuBtnSelector = '*[data-uf="menu-btn"]';

export const categorySelector = (c: string): string => {
  return `*[data-uf="menu-cat-${c}"]`;
};

export const genreSelector = (g: string): string => {
  return `*[data-uf="menu-gen-${g}"]`;
};
