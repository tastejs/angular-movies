import { LetModule } from '@rx-angular/template/let';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListCreateEditPageComponent } from './list-create-page.component';
import { ROUTES } from './list-create-page.routes';

@NgModule({
  declarations: [ListCreateEditPageComponent],
  imports: [LetModule, CommonModule, RouterModule.forChild(ROUTES)],
  exports: [ListCreateEditPageComponent],
})
export class ListCreatePageModule {}
