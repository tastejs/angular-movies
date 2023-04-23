import { ImageTag } from '../../../shared/cdk/image/image-tag.interface';
import { LinkTag } from '../../../shared/cdk/link/a-tag.interface';
import { VideoTag } from '../../../shared/cdk/video/video.interface';
import { TMDBMovieDetailsModel } from '../../../data-access/api/model/movie-details.model';

export type MovieDetail = TMDBMovieDetailsModel &
  LinkTag &
  ImageTag &
  VideoTag & { languages_runtime_release: string };
