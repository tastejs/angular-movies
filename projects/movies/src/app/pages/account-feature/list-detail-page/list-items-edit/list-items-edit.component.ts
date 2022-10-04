import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TMDBMovieDetailsModel } from '../../../../data-access/api/model/movie-details.model';

import { trackByProp } from '../../../../shared/utils/track-by';
import {
  ListItemsEditAdapter,
  MovieSearchResult,
} from './list-items-edit.adapter';
import { ForModule } from '@rx-angular/template/for';
import { LetModule } from '@rx-angular/template';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
@Component({
  standalone: true,
  imports: [ForModule, LetModule, FastSvgModule],
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
