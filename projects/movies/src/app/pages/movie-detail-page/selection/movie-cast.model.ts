import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { TMDBMovieCastModel } from '../../../data-access/api/model/movie-credits.model';

export type MovieCast = TMDBMovieCastModel & ImageTag;
