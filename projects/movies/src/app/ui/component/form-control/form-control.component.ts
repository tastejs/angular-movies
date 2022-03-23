import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ui-form-control',
  template: `
    <ng-content></ng-content>`,
  styles: ['./form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})
export class FormControlComponent {
}
