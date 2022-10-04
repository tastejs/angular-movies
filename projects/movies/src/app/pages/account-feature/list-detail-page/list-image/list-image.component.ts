import { ChangeDetectionStrategy, Component } from '@angular/core';
import { trackByProp } from 'projects/movies/src/app/shared/utils/track-by';
import { ListDetailAdapter, ListPoster } from '../list-detail-page.adapter';
import { ForModule } from '@rx-angular/template/for';
import { GridListComponent } from '../../../../ui/component/grid-list/grid-list.component';

@Component({
  standalone: true,
  imports: [ForModule, GridListComponent],
  selector: 'ct-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListImageComponent {
  constructor(public adapter: ListDetailAdapter) {}

  trackByPosterId = trackByProp<ListPoster>('id');
}
