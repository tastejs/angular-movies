import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackdropModule } from '../backdrop/backdrop.module';
import { SideDrawerComponent } from './side-drawer.component';

@NgModule({
  imports: [BackdropModule, CommonModule],
  exports: [SideDrawerComponent],
  declarations: [SideDrawerComponent]
})
export class SideDrawerModule {
}
