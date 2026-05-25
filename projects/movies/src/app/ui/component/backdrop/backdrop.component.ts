import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ui-backdrop',
  template: ``,
  styleUrls: ['./backdrop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BackdropComponent {
  @HostBinding('class.opened')
  @Input({ required: true })
  opened = false;
}
