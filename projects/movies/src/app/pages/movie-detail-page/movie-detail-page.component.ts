import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';

import {
  MovieDetailAdapter,
  MovieDetailPageModel,
} from './movie-detail-page.adapter';
import { map } from 'rxjs';

@Component({
  selector: 'ct-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState],
})
export class MovieDetailPageComponent {
  readonly detailState$ = this.state.select(
    selectSlice(['loading', 'movie', 'cast'])
  );
  readonly recommendations$ = this.state.select(
    map(({ recommendations }) => recommendations?.results || [])
  );

  constructor(
    private location: Location,
    private adapter: MovieDetailAdapter,
    private state: RxState<MovieDetailPageModel>
  ) {
    this.state.set({
      cast: [],
      loading: true,
    });
    this.state.connect(this.adapter.routedMovieSlice$);
    this.state.connect(
      'recommendations',
      this.adapter.movieRecommendationsById$
    );
    this.state.connect('cast', this.adapter.movieCastById$);
  }

  back() {
    this.location.back();
  }

  paginate() {
    this.adapter.paginate();
  }

  trackByGenre: TrackByFunction<TMDBMovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<TMDBMovieCastModel> = (_, cast) => cast.cast_id;
}
