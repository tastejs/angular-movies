import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TMDBMovieDetailsModel } from '../../../../data-access/api/model/movie-details.model';
import { MovieResponse } from '../../../../data-access/api/resources/movie.resource';

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

  trackByMovieId = trackByProp<MovieResponse>('id');
  trackByResultId = trackByProp<Partial<TMDBMovieDetailsModel>>('id');
}
