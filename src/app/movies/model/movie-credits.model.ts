import {MovieCastModel} from './movie-cast.model';
import {MovieCrewModel} from './movie-crew.model';

export interface MovieCreditsModel {
    id: number;
    cast: MovieCastModel[];
    crew: MovieCrewModel[];
}
