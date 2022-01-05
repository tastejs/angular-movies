import { TMDBMovieModel } from './movie.model';
import { TMDBPaginatedResult } from '../pagination/pagination.interface';
import { TMDBFilterOptions } from './filter.interface';

export type TMDBMovieCategoryModel = TMDBPaginatedResult<TMDBMovieModel> &
  TMDBFilterOptions;
