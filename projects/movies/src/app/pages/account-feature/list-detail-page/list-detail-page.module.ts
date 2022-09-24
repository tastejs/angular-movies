import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListDetailPageComponent } from './list-detail-page.component';
import { ROUTES } from './list-detail-page.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListDetailPageComponent],
})
export class ListDetailsPageModule {}
