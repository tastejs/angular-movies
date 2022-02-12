import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCreateEditPageComponent } from './list-create-page.component';
import { ListEditFormComponentModule } from '../../../ui/pattern/list-edit-form/list-edit-form.component';
import { ROUTES } from './list-create-page.routes';

@NgModule({
  declarations: [ListCreateEditPageComponent],
  imports: [ListEditFormComponentModule, RouterModule.forChild(ROUTES)],
  exports: [ListCreateEditPageComponent],
})
export class ListCreatePageModule {}
