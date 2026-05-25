import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-grid-list',
  template: `
    <ng-content select=".ui-grid-list-item" />
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./grid-list.component.css'],
})
export class GridListComponent {}
