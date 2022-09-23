import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCreateEditPageComponent } from './list-create-page.component';
import { ROUTES } from './list-create-page.routes';

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES), ListCreateEditPageComponent],
  exports: [ListCreateEditPageComponent],
})
export class ListCreatePageModule {}
