import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { addVideoTag } from '../../../shared/cdk/video/video-tag.transform';
import { addImageTag } from '../../../shared/cdk/image/image-tag.transform';
import {
  W154H205,
  W300H450,
  W92H138,
} from '../../../data-access/api/constants/image-sizes';
import { MovieDetail } from './movie-detail.model';
import { addLinkTag } from '../../../shared/cdk/link/a-tag.transform';
import { TMDBMovieCastModel } from '../../../data-access/api/model/movie-credits.model';
import { MovieCast } from './movie-cast.model';
import {Movie} from "../../../state/movie.state";

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
  addImageTag(res, { pathProp: 'poster_path', dims: W300H450, sizes: `(min-width: 900px) 400px, 65vw`,  srcset: '154w, 185w, 342w, 500w, 780w' });
  addLinkTag(res, 'imdb_id', {});
  return res as MovieDetail;
}
export function transformToCastList(_res: TMDBMovieCastModel): MovieCast {
  const res = _res as unknown as MovieCast;
  addImageTag(res, { pathProp: 'profile_path', dims: W92H138, sizes: `44px`,  srcset: '154w' });
  return res;
}
export function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, { pathProp: 'poster_path', dims: W154H205, sizes: '(min-width: 900px) 20vw, 70vw', srcset: '154w, 185w, 342w, 500w, 780w' });
}
