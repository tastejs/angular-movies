import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { TMDBMovieDetailsModel } from '../../../data-access/api/model/movie-details.model';
import { MovieResponse } from '../../../data-access/api/resources/movie.resource';

import { RxForModule } from '../../../shared/rxa-custom/rx-for/rx-for.module';
import { trackByProp } from '../../../shared/utils/track-by';
import { ListItemsEditAdapter } from './list-items-edit.adapter';
@Component({
  selector: 'ui-list-items-edit',
  templateUrl: './list-items-edit.component.html',
  styleUrls: ['./list-items-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemsEditComponent {
  constructor(public adapter: ListItemsEditAdapter) {}

  trackByMovieId = trackByProp<MovieResponse>('id');
  trackByResultId = trackByProp<TMDBMovieDetailsModel>('id');
}

@NgModule({
  imports: [RxForModule],
  declarations: [ListItemsEditComponent],
  exports: [ListItemsEditComponent],
})
export class ListItemsEditComponentModule {}
