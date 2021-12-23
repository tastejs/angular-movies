import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ds-detail-grid',
  template: `
    <div class="grid--item gradient">
      <ng-content select="[detailGridMedia]"></ng-content>
    </div>
    <div class="grid--item media">
      <ng-content select="[detailGridDescription]"></ng-content>
    </div>
  `,
  styleUrls: ['./detail-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailGridComponent {

}
