import { NgModule } from '@angular/core';
import { LazyDirective } from './lazy.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LazyDirective],
  imports: [CommonModule],
  exports: [LazyDirective],
})
export class LazyModule {}
