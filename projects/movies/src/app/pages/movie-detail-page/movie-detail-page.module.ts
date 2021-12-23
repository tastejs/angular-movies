import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { LoaderComponentModule } from '../../ui/atoms/loader/loader.component';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import { StarRatingModule } from '../../ui/atoms/star-rating/star-rating.module';
import { AspectRatioBoxModule } from '../../ui/atoms/aspect-ratio-box/aspect-ratio-box.module';
import { MovieListModule } from '../../ui/components/movie-list/movie-list.module';
import { HeaderModule } from '../../ui/components/header/header.module';
import { TitleModule } from '../../ui/atoms/title/title.module';
import { SubtitleModule } from '../../ui/atoms/subtitle/subtitle.module';
import { ContainerModule } from '../../ui/atoms/container/container.module';
import { DetailGridComponent } from '../../ui/atoms/detail-grid/detail-grid.component';
import { SectionModule } from '../../ui/atoms/section/section.module';

const ROUTES: Routes = [
  {
    path: '',
    component: MovieDetailPageComponent,
  },
];

@NgModule({
  declarations: [MovieDetailPageComponent, DetailGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    StarRatingModule,
    MovieListModule,
    LetModule,
    LoaderComponentModule,
    AspectRatioBoxModule,
    HeaderModule,
    TitleModule,
    SubtitleModule,
    ContainerModule,
    SectionModule
  ],
  exports: [MovieDetailPageComponent],
})
export class MovieDetailPageModule {}
