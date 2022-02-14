import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ct-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListImageComponent {}
