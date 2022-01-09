import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { addVideoTag } from '../../../shared/utils/video/video-tag.transform';
import { addImageTag } from '../../../shared/utils/image/image-tag.transform';
import { W780H1170 } from '../../../data-access/api/constants/image-sizes';
import { MovieDetail } from './movie-detail.model';

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
  addImageTag(res, { pathProp: 'poster_path', dims: W780H1170 });
  return res as MovieDetail;
}
