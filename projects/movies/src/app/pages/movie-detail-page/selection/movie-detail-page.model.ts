import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { TMDBMovieCastModel } from '../../../data-access/api/model/movie-credits.model';
import { MovieDetail } from './movie-detail.model';

export interface MovieDetailPageModel {
  loading: boolean;
  movie: MovieDetail;
  recommendations: TMDBMovieModel[];
  cast: TMDBMovieCastModel[];
}
