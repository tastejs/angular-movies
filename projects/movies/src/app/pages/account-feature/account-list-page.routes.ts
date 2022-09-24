import { Routes } from '@angular/router';
import { ROUTES as AccountListPageRoutes } from './account-list-page/account-list-page.routes';
import { ROUTES as AccountListCreateRoutes } from './list-create-page/list-create-page.routes';

export const ROUTES: Routes = [
  ...AccountListPageRoutes,
  ...AccountListCreateRoutes,
];
