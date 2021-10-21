import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImgDirective } from './lazy-img.directive';

@NgModule({
  declarations: [LazyImgDirective],
  imports: [CommonModule],
  exports: [LazyImgDirective],
})
export class LazyImgModule {}
