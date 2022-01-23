import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundIconComponent } from './not-found-icon.component';
import { NotFoundPageComponent } from './not-found-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [NotFoundPageComponent, NotFoundIconComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
