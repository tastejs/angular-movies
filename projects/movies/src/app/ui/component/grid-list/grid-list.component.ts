import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-grid-list',
  template: `
    <ng-content select=".ui-grid-list-item"></ng-content>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent {}
