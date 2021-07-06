import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MovieListComponent} from './movie-list.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    MovieListComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    LazyLoadImageModule,
    TranslateModule
  ],
  exports: [
    MovieListComponent
  ]
})
export class MovieListModule { }
