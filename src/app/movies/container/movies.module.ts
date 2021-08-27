import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoaderComponentModule } from '../../shared/component/loader/loader.component';
import { MoviesComponent } from './movies.component';
import { MovieListModule } from '../movie-list/movie-list.module';
import { LetModule } from '@rx-angular/template/let';

const ROUTES: Routes = [{ path: '', component: MoviesComponent }];

@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MovieListModule,
    // PaginationModule,
    LetModule,
    LoaderComponentModule,
  ],
  exports: [MoviesComponent],
})
export class MoviesModule {}
