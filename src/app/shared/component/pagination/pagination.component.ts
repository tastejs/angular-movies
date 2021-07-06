import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() pager: any = {};
  @Output() currentPage = new EventEmitter<number>();

  setPage(page: number) {
    this.currentPage.emit(page);
  }

}
