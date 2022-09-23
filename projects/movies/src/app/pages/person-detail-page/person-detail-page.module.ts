import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonDetailPageComponent } from './person-detail-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PersonDetailPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES), PersonDetailPageComponent],
  exports: [PersonDetailPageComponent],
})
export class PersonDetailPageModule {}
