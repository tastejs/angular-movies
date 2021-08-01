import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { EMPTY, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Pager } from '../../shared/model/pager.model';
import { StateService } from '../../shared/service/state.service';
import { Tmdb2Service } from '../../shared/service/tmdb/tmdb2.service';
import { MovieModel } from '../model/movie.model';

type MoviesState = {
  loading: boolean;
  movies: MovieModel[] | null;
  title: string | null;
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
  request: Observable<any>;
  dataParam: string;
  movies: MovieModel[];
  state$: Observable<{
    loading: boolean;
    movies: MovieModel[];
    title: string;
  }> = this.route.params.pipe(
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
    })
  );

  currentPage: number;
  pager: Pager;
  totalPages: number;
  title: string | number;
  loading: boolean;
  moviesType: Params;

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
        return of({ loading: false, movies: null, title: null });
      }),
      startWith({ loading: true, movies: null, title: null })
    );
}
