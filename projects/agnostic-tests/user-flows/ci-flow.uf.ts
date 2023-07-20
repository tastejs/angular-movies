import {setupCiFlow} from "../src/user-flows/ci-flow.uf";
import {
  ANIM_DURATION_STANDARD,
  backBtnSelector,
  castImgSelector,
  categorySelector,
  genreSelector,
  heandlineSelector,
  heroImageSelector,
  movieImgSelector,
  sideMenuBtnSelector,
  subheandlineSelector
} from "../src/fixtures";
import {MovieDetailPageUFO, MovieListPageUFO} from "../../movies-user-flows/src";

export default setupCiFlow((ctx) => {
    return {
      movieDetailPage: new MovieDetailPageUFO(ctx, {
        movieImgSelector,
        subheandlineSelector,
        castImgSelector,
        heandlineSelector,
        heroImageSelector,
        backBtnSelector
      }),
      movieListPage: new MovieListPageUFO(ctx, {movieImgSelector, subheandlineSelector, heandlineSelector})
    }
  },
  {
    topRatedName: 'topRated',
    ANIM_DURATION: ANIM_DURATION_STANDARD,
    categorySelector,
    genreSelector,
    heandlineSelector,
    movieImgSelector,
    sideMenuBtnSelector,
    subheandlineSelector
  })
