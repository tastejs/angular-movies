import { TvCastModel } from './tv-cast.model';
import { TvCrewModel } from './tv-crew.model';

export interface TvCreditsModel {
    id: number;
    cast: TvCastModel[];
    crew: TvCrewModel[];
}
