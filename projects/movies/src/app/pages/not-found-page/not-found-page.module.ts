import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SvgIconModule } from '../../ui/component/icons/icon.module';
import { NotFoundPageComponent } from './not-found-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), SvgIconModule],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
