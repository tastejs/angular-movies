import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { LinkTag } from '../../../shared/utils/link/a-tag.interface';
import { VideoTag } from '../../../shared/utils/video/video.interface';
import { TMDBMovieDetailsModel } from '../../../data-access/api/model/movie-details.model';

export type MovieDetail = TMDBMovieDetailsModel &
  LinkTag &
  ImageTag &
  VideoTag & { languages_runtime_release: string };
