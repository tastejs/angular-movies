import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ct-list-share',
  templateUrl: './list-share.component.html',
  styleUrls: ['./list-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListShareComponent {}
