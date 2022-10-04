import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TMDBMovieDetailsModel } from '../../../../data-access/api/model/movie-details.model';

import { trackByProp } from '../../../../shared/utils/track-by';
import {
  ListItemsEditAdapter,
  MovieSearchResult,
} from './list-items-edit.adapter';
import { ForModule } from '@rx-angular/template/experimental/for';
import { LetModule } from '@rx-angular/template';
import { FastIconModule } from '../../../../shared/fast-icon/fast-icon.module';

@Component({
  standalone: true,
  imports: [ForModule, LetModule, FastIconModule],
  selector: 'ct-list-items-edit',
  templateUrl: './list-items-edit.component.html',
  styleUrls: ['./list-items-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemsEditComponent {
  constructor(public adapter: ListItemsEditAdapter) {}

  trackByMovieId = trackByProp<MovieSearchResult>('id');
  trackByResultId = trackByProp<Partial<TMDBMovieDetailsModel>>('id');
}
