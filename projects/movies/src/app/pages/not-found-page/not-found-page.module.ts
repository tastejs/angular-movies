import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES), NotFoundPageComponent],
  exports: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
