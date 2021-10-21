import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListPageComponent } from './movie-list-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MovieListModule } from '../../ui/components/movie-list/movie-list.module';
import { LetModule } from '@rx-angular/template/let';
import { LoaderComponentModule } from '../../ui/atoms/loader/loader.component';


const ROUTES: Routes = [
  {
    path: '',
    component: MovieListPageComponent,
  }
];

@NgModule({
  declarations: [MovieListPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MovieListModule,
    LetModule,
    LoaderComponentModule,
  ],
  exports: [MovieListPageComponent],
})
export class MovieListPageModule { }
