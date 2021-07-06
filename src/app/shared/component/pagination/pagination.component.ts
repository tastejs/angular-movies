import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy, TrackByFunction} from '@angular/core';
import {Pager} from '../../model/pager.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() pager: Pager = null;
  @Output() currentPage = new EventEmitter<number>();

  setPage(page: number) {
    this.currentPage.emit(page);
  }

  trackByPage: TrackByFunction<number> = (idx, page) => page;

}
