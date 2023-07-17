export const movieImgSelector = (idx: number): string =>
  `*[data-uf="movie-${idx}"]`;

export const movieImgAttr = (idx: number): string => `data-uf="movie-${idx}"`;
