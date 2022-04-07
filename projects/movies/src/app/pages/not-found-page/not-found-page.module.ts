import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FastIconModule } from '../../shared/fast-icon/fast-icon.module';
import { NotFoundPageComponent } from './not-found-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), FastIconModule],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
