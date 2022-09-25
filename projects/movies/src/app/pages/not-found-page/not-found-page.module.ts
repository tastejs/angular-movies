import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { NotFoundPageComponent } from './not-found-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), FastSvgModule],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
