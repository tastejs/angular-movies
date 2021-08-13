import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { LetModule } from '@rx-angular/template';
import { LoaderComponentModule } from '../../shared/component/loader/loader.component';
import { MovieComponent } from './movie.component';
import { MovieTrailerModule } from './movie-trailer/movie-trailer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { StarRatingModule } from '../../shared/component/star-rating/star-rating.module';
import { MovieListModule } from '../movie-list/movie-list.module';
import { AspectRatioBoxModule } from '../../shared/component/aspect-ratio-box/aspect-ratio-box.module';

@NgModule({
  declarations: [MovieComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MovieTrailerModule,
    StarRatingModule,
    MovieListModule,
    LetModule,
    LoaderComponentModule,
    AspectRatioBoxModule,
  ],
  exports: [MovieComponent],
})
export class MovieModule {}
