import {TMDBMovieModel} from './movie.model';

export interface TMDBMovieCategoryModel {
    page: number;
    results: TMDBMovieModel[];
    dates?: {
        maximum: string;
        minimum: string;
    };
    total_pages: number;
    total_results: number;
}
