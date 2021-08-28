import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { select } from '@rx-angular/state';
import {
  EMPTY,
  MonoTypeOperatorFunction,
  Observable,
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  withLatestFrom,
  of,
  shareReplay,
} from 'rxjs';

import { StateService } from '../../shared/service/state.service';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';
import { MovieModel } from '../model';

type MoviesState = {
  loading: boolean;
  movies?: MovieModel[];
  title?: string;
};

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent {
  movies: MovieModel[] = [];
  state$: Observable<MoviesState> = this.route.params.pipe(
    switchMap(({ category, genre }) => {
      if (category) {
        return this.tmdb2Service.getMovieCategory(category).pipe(
          map((data) => ({
            loading: false,
            movies: data.results,
            title: category,
          })),
          moviesState()
        );
      }
      if (genre) {
        const genreId = parseInt(genre, 10);
        return this.tmdb2Service.getMovieGenre(genre).pipe(
          withLatestFrom(this.tmdbState.genres$.pipe(filter((g) => g != null))),
          map(([data, genres]) => ({
            loading: false,
            movies: data.results,
            title: genres?.find((g) => g.id === genreId)?.name,
          })),
          moviesState()
        );
      }
      return EMPTY;
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly movies$ = this.state$.pipe(select('movies')) as Observable<
    MovieModel[]
  >;
  readonly loading$ = this.state$.pipe(select('loading'));
  readonly title$ = this.state$.pipe(select('title'));

  constructor(
    private tmdb2Service: Tmdb2Service,
    private tmdbState: StateService,
    private route: ActivatedRoute
  ) {}
}

function moviesState(): MonoTypeOperatorFunction<MoviesState> {
  return (o$) =>
    o$.pipe(
      catchError((e) => {
        console.error(e);
        return of({ loading: false, movies: [], title: undefined });
      }),
      startWith({ loading: true, movies: [], title: undefined })
    );
}
