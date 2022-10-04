import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-detail-grid',
  template: `
    <div class="grid--item gradient">
      <ng-content select="[detailGridMedia]"></ng-content>
    </div>
    <div class="grid--item media">
      <ng-content select="[detailGridDescription]"></ng-content>
    </div>
  `,
  styleUrls: ['./detail-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DetailGridComponent {}
