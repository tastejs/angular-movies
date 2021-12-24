import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-form-control',
  template: `<ng-content></ng-content>`,
  styles: ['./form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlComponent {}

@NgModule({
  declarations: [FormControlComponent],
  exports: [FormControlComponent],
})
export class FormControlComponentModule {}
