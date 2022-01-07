import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';
import { MovieListModule } from '../../ui/pattern/movie-list/movie-list.module';

const ROUTES: Routes = [
  {
    path: '',
    component: AccountListPageComponent,
  },
];

@NgModule({
  declarations: [AccountListPageComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), MovieListModule],
  exports: [AccountListPageComponent],
})
export class AccountListPageModule {}
