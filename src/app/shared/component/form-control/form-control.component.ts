import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-form-control',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        margin: 8px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      :host > :global(label + *) {
        margin-top: 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlComponent {}

@NgModule({
  declarations: [FormControlComponent],
  exports: [FormControlComponent],
})
export class FormControlComponentModule {}
