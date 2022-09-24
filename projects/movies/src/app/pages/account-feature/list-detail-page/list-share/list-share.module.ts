import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListShareComponent } from './list-share.component';
import { ROUTES } from './list-share.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES), ListShareComponent],
})
export class ListShareComponentModule {}
