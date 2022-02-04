import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ListDetailAdapter } from './list-detail-page.adapter';
@Component({
  selector: 'ct-list-detail-page',
  templateUrl: './list-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDetailPageComponent implements OnDestroy {
  readonly tabs = ['Edit List', 'Add/Remove Items', 'Delete List'];
  constructor(public adapter: ListDetailAdapter) {}

  ngOnDestroy(): void {
    this.adapter.set({ activeTabIndex: 0 });
  }
}
