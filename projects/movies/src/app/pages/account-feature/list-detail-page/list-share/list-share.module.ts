import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROUTES } from './list-share.routes';

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
})
export class ListShareComponentModule {}
