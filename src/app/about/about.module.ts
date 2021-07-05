import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutComponent} from './container/about.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [AboutComponent],
  exports: [AboutComponent],
})
export class AboutModule {
}
