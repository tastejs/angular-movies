import { NgModule } from '@angular/core';
import { ElementVisibilityDirective } from './element-visibility.directive';

@NgModule({
  declarations: [ElementVisibilityDirective],
  exports: [ElementVisibilityDirective],
})
export class ElementVisibilityModule {}
