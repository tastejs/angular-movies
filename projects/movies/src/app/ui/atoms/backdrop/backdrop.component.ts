import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  template: ``,
  styleUrls: ['./backdrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackdropComponent {
  @HostBinding('class.opened')
  @Input()
  opened = false;
}

@NgModule({
  imports: [],
  exports: [BackdropComponent],
  declarations: [BackdropComponent]
})
export class BackdropComponentModule {
}
