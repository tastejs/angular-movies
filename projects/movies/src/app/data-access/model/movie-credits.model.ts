import {TMDBMovieCastModel} from './movie-cast.model';
import {TMDBMovieCrewModel} from './movie-crew.model';

export interface TMDBMovieCreditsModel {
    id: number;
    cast: TMDBMovieCastModel[];
    crew: TMDBMovieCrewModel[];
}
