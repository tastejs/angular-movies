import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {trackByProp} from '../../../../shared/cdk/track-by';
import {ListDetailAdapter, ListPoster} from '../list-detail-page.adapter';
import {RxFor} from '@rx-angular/template/for';
import {GridListComponent} from '../../../../ui/component/grid-list/grid-list.component';
import {NgOptimizedImage} from '@angular/common';

@Component({
  standalone: true,
  imports: [RxFor, GridListComponent, NgOptimizedImage],
  selector: 'ct-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListImageComponent {
  public adapter = inject(ListDetailAdapter);

  trackByPosterId = trackByProp<ListPoster>('id');
}
