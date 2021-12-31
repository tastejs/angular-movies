import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';
import { Router } from '@angular/router';
import { MovieDetailAdapter } from './movie-detail-page.adapter';
import { MovieDetailPageModel } from './selection/movie-detail-page.model';

@Component({
  selector: 'ct-movie',
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

  toGenre(genre: TMDBMovieGenreModel) {
    this.router.navigate(['/list', 'genre', genre.id]);
  }

  back() {
    this.location.back();
  }

  trackByGenre: TrackByFunction<TMDBMovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<TMDBMovieCastModel> = (_, cast) => cast.cast_id;
}
