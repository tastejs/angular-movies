import { NgModule } from '@angular/core';
import { ListImageComponent } from './list-image.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-image.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListImageComponent],
})
export class ListImageComponentModule {}
