import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListDetailAdapter } from './list-detail-page.adapter';
@Component({
  selector: 'ct-list-detail-page',
  templateUrl: './list-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListDetailPageComponent {
  readonly tabs = [
    {
      name: 'View List',
      link: 'view',
    },
    {
      name: 'Edit List',
      link: 'edit',
    },
    {
      name: 'Add/Remove Items',
      link: 'add-remove-items',
    },
    {
      name: 'Choose Image',
      link: 'image',
    },
    {
      name: 'Share',
      link: 'share',
    },
    {
      name: 'Delete List',
      link: 'delete',
    },
  ];
  constructor(public adapter: ListDetailAdapter) {}
}
