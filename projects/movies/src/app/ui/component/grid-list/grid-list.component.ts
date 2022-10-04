import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-grid-list',
  template: `
    <ng-content select=".ui-grid-list-item"></ng-content>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./grid-list.component.scss'],
})
export class GridListComponent {}
