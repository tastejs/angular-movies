import { NgModule } from '@angular/core';
import { ListRemoveComponent } from './list-remove.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-remove.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListRemoveComponent],
  declarations: [],
})
export class ListRemoveComponentModule {}
