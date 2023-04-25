import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { addVideoTag } from '../../../shared/cdk/video/video-tag.transform';
import { addImageTag } from '../../../shared/cdk/image/image-tag.transform';
import {
  SIZES, W154H205,
  W300H450,
  W92H138,
} from '../../../data-access/api/constants/image-sizes';
import { MovieDetail } from './movie-detail.model';
import { addLinkTag } from '../../../shared/cdk/link/a-tag.transform';
import { TMDBMovieCastModel } from '../../../data-access/api/model/movie-credits.model';
import { MovieCast } from './movie-cast.model';
import {BREAKPOINTS} from "../../../configuration/breakpoints";
import {Movie} from "../../../state/movie.state";

/**
 * Person Detail Page - Hero img
 *
 * Screen: xs
 * <img>
 *  __
 * <p>
 *
 * Screen: s
 * <img>
 * __
 * <p>
 *
 * Screen: m
 * <img> | <p>
 *
 * Screen: l
 * <img> | <p>
 *
 * Screen: xl
 * <img> | <p>
 *
 */

export const MOVIE_DETAIL_HERO_IMG_SIZE = `${BREAKPOINTS.xSmall} ${SIZES["342w"]}, ${BREAKPOINTS.small} ${SIZES["342w"]}, ${BREAKPOINTS.mobile} ${SIZES["185w"]}, ${BREAKPOINTS.isLargeDesktop} ${SIZES["500w"]}`;
/**
 * Pattern: Movie List - List Img
 *
 * Screen: xs
 * <img>
 *  __
 * <p>
 *
 * Screen: s
 * <img>
 * __
 * <p>
 *
 * Screen: m
 * <img> | <p>
 *
 * Screen: l
 * <img> | <p>
 *
 * Screen: xl
 * <img> | <p>
 *
 */
export const MOVIE_DETAIL_RECOMMENDATION_LIST_IMG_SIZE = `${BREAKPOINTS.xSmall} ${SIZES["154w"]}, ${BREAKPOINTS.small} ${SIZES["185w"]}, ${BREAKPOINTS.mobile} ${SIZES["342w"]}, ${BREAKPOINTS.isLargeDesktop} ${SIZES["342w"]}`;

export const MOVIE_DETAIL_CAST_LIST_IMG_SIZE = `${BREAKPOINTS.xSmall} ${SIZES["154w"]}`;


export function transformToMovieDetail(_res: TMDBMovieModel): MovieDetail {
  const res = _res as unknown as MovieDetail;
  let language: string | boolean = false;
  if (
    Array.isArray(res?.spoken_languages) &&
    res?.spoken_languages.length !== 0
  ) {
    language = res.spoken_languages[0].english_name;
  }
  res.languages_runtime_release = `${language + ' / ' || ''} ${
    res.runtime
  } MIN. / ${new Date(res.release_date).getFullYear()}`;

  addVideoTag(res, { pathPropFn: (r: any) => r?.videos?.results[0]?.key + '' });
  addImageTag(res, { pathProp: 'poster_path', dims: W300H450, sizes: MOVIE_DETAIL_HERO_IMG_SIZE });
  addLinkTag(res, 'imdb_id', {});
  return res as MovieDetail;
}
export function transformToCastList(_res: TMDBMovieCastModel): MovieCast {
  const res = _res as unknown as MovieCast;
  addImageTag(res, { pathProp: 'profile_path', dims: W92H138, sizes: MOVIE_DETAIL_CAST_LIST_IMG_SIZE });
  return res;
}

/**
 * Movie List - List Img
 *
 * Screen: xs
 * <img>
 *  __
 * <p>
 *
 * Screen: s
 * <img>
 * __
 * <p>
 *
 * Screen: m
 * <img> | <p>
 *
 * Screen: l
 * <img> | <p>
 *
 * Screen: xl
 * <img> | <p>
 *
 */
export const MOVIE_LIST_RECOMMENDATIONS_LIST_IMG_SIZE = `(${BREAKPOINTS.xSmall}) ${SIZES["154w"]}, (${BREAKPOINTS.small}) ${SIZES["185w"]}, (${BREAKPOINTS.mobile}) ${SIZES["342w"]}, (${BREAKPOINTS.isLargeDesktop}) ${SIZES["342w"]}`;
export function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, { pathProp: 'poster_path', dims: W154H205, sizes: MOVIE_LIST_RECOMMENDATIONS_LIST_IMG_SIZE });
}
