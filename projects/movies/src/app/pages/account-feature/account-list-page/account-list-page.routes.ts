import { Routes } from '@angular/router';
import { AccountListPageComponent } from './account-list-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-lists',
  },
  {
    path: 'my-lists',
    component: AccountListPageComponent,
  },
];
