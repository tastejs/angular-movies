import { NgModule } from '@angular/core';
import { BypassSrcDirective } from './bypass-src.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [BypassSrcDirective],
  imports: [CommonModule],
  exports: [BypassSrcDirective]
})
export class BypassSrcModule {


}
