import {
  Component,
  ChangeDetectionStrategy,
  Input,
  NgModule,
} from '@angular/core';
import { ForModule } from '@rx-angular/template/experimental/for';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ui-tabs',
  template: `<ng-container *rxFor="let item of items; index as idx">
    <a [routerLink]="item.link" routerLinkActive="active">{{ item.name }}</a>
    <!-- <input
      (change)="tabChange.next(idx)"
      [checked]="!idx"
      type="radio"
      name="tabs"
      [id]="'tab' + idx"
    />
    <label [for]="'tab' + idx">{{ item }}</label> -->
  </ng-container>`,
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() items?: {
    link: string;
    name: string;
  }[];
  constructor() {}
}

@NgModule({
  imports: [ForModule, RouterModule],
  declarations: [TabsComponent],
  exports: [TabsComponent],
})
export class TabsComponentModule {}
