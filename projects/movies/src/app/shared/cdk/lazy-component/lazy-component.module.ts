import { NgModule } from '@angular/core';
import { LazyComponentDirective } from './lazy-component.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LazyComponentDirective],
  imports: [CommonModule],
  exports: [LazyComponentDirective],
})
export class LazyComponentModule {}
