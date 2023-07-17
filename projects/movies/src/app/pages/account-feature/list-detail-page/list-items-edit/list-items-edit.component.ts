import {RxLet} from '@rx-angular/template/let';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TMDBMovieDetailsModel} from '../../../../data-access/api/model/movie-details.model';

import {trackByProp} from '../../../../shared/cdk/track-by';
import {ListItemsEditAdapter, MovieSearchResult,} from './list-items-edit.adapter';
import {RxFor} from '@rx-angular/template/for';
import {FastSvgComponent} from '@push-based/ngx-fast-svg';
import {NgOptimizedImage} from '@angular/common';

@Component({
  standalone: true,
  imports: [NgOptimizedImage, RxFor, RxLet, FastSvgComponent],
  selector: 'ct-list-items-edit',
  templateUrl: './list-items-edit.component.html',
  styleUrls: ['./list-items-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListItemsEditComponent {
  public readonly adapter = inject(ListItemsEditAdapter);

  trackByMovieId = trackByProp<MovieSearchResult>('id');
  trackByResultId = trackByProp<Partial<TMDBMovieDetailsModel>>('id');
}
