import { ChangeDetectionStrategy, Component } from '@angular/core';
import { trackByProp } from 'projects/movies/src/app/shared/utils/track-by';
import { ListDetailAdapter, ListPoster } from '../list-detail-page.adapter';

@Component({
  selector: 'ct-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListImageComponent {
  constructor(public adapter: ListDetailAdapter) {}

  trackByPosterId = trackByProp<ListPoster>('id');
}
