import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('app/about/about.routed.module').then((m) => m.AboutRoutedModule),
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('app/sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('app/account/account.module').then((m) => m.AccountModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'movies/popular' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
