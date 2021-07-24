import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
