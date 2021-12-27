import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { MovieCastModel } from '../../data-access/model/movie-cast.model';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { Router } from '@angular/router';
import { MovieDetailAdapter, MovieDetailPageModel } from './movie-detail-page.adapter';

@Component({
  selector: 'app-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class MovieDetailPageComponent {
  readonly detailState$ = this.state.select(
    selectSlice(['loading', 'movie', 'cast'])
  );
  readonly recommendedLoading$ = this.state.select('loading');
  readonly recommendations$ = this.state.select('recommendations');

  constructor(
    private location: Location,
    private adapter: MovieDetailAdapter,
    private router: Router,
    private state: RxState<MovieDetailPageModel>
  ) {
    this.state.set({
      recommendations: [],
      cast: [],
      loading: true
    });
    this.state.connect(this.adapter.routedMovieSlice$);
    this.state.connect('recommendations', this.adapter.movieRecomendationsById$);
    this.state.connect('cast', this.adapter.movieCastById$);
  }

  toGenre(genre: MovieGenreModel) {
    this.router.navigate(['/list', 'genre', genre.id]);
  }

  back() {
    this.location.back();
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<MovieCastModel> = (_, cast) => cast.cast_id;
}
