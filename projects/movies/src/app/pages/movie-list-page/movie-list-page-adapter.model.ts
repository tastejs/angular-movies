import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { RouterParams } from '../../shared/router/router.model';
import { InfiniteScrollState } from '../../shared/cdk/infinite-scroll/infinite-scroll.interface';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>;
export type MovieListPageModel = InfiniteScrollState<TMDBMovieModel> &
  MovieListRouterParams & { genres: Record<string, TMDBMovieGenreModel> };
