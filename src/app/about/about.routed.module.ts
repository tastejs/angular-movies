import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AboutModule} from './about.module';
import {ROUTES} from './routes';


@NgModule({
  imports: [
    AboutModule,
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule]
})
export class AboutRoutedModule {
}
