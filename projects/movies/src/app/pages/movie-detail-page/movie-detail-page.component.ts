import { select } from '@rx-angular/state/selections';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { map, startWith, Subject, tap } from 'rxjs';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';

import { MovieDetailAdapter } from './movie-detail-page.adapter';

@Component({
  selector: 'ct-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MovieDetailPageComponent {
  readonly movieCtx$ = this.adapter.routedMovieCtx$;
  readonly movie$ = this.movieCtx$.pipe(
    map((ctx) => ctx?.value || null),
    tap((v) => console.log('movie', v))
  );
  readonly castList$ = this.adapter.movieCastById$;
  readonly castListLoading$ = this.adapter.movieCastById$.pipe(
    select('loading')
  );
  readonly infiniteScrollRecommendations$ =
    this.adapter.infiniteScrollRecommendations$;

  readonly rendered$ = new Subject<unknown>();
  readonly strategy$ = this.rendered$.pipe(
    map(() => 'normal'),
    startWith('native')
  );

  constructor(
    private location: Location,
    private adapter: MovieDetailAdapter
  ) {}

  back() {
    this.location.back();
  }

  paginateRecommendations() {
    this.adapter.paginateRecommendations();
  }

  trackByGenre: TrackByFunction<TMDBMovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<TMDBMovieCastModel> = (_, cast) => cast.cast_id;
}
