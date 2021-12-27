import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  template: ``,
  styleUrls: ['./backdrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class BackdropComponent {
  @HostBinding('class.opened')
  @Input()
  opened = false;
}
