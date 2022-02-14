import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TMDBMovieModel } from 'projects/movies/src/app/data-access/api/model/movie.model';
import { ImageTag } from 'projects/movies/src/app/shared/utils/image/image-tag.interface';
import { TMDBMovieDetailsModel } from '../../../../data-access/api/model/movie-details.model';

import { trackByProp } from '../../../../shared/utils/track-by';
import { ListItemsEditAdapter } from './list-items-edit.adapter';
@Component({
  selector: 'ct-list-items-edit',
  templateUrl: './list-items-edit.component.html',
  styleUrls: ['./list-items-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemsEditComponent {
  constructor(public adapter: ListItemsEditAdapter) {}

  trackByMovieId = trackByProp<TMDBMovieModel & ImageTag>('id');
  trackByResultId = trackByProp<Partial<TMDBMovieDetailsModel>>('id');
}
