import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { catchError, EMPTY, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MovieModel } from '../../data-access/model';
import { StateService } from '../../shared/state/state.service';


type MoviesState = {
  loading: boolean;
  movies: MovieModel[];
  title: string;
};

type RouterParams = {
  type: string;
  identifier: string;
};

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styles: [
      `
      :host {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent extends RxState<MoviesState> {
  movies: MovieModel[] = [];

  readonly movies$ = this.select('movies');
  readonly loading$ = this.select('loading');
  readonly title$ = this.select('title');

  private routerParams$: Observable<RouterParams> = this.route.params as unknown as Observable<RouterParams>;

  constructor(
    private tmdbState: StateService,
    private route: ActivatedRoute
  ) {
    super();

    this.connect(this.getListByRouterParams());

    this.hold(this.routerParams$,
      ({ type, identifier }) => {
        if (type === 'category') {
          this.tmdbState.fetchCategoryMovies(identifier);
        } else if (type === 'genre') {
          this.tmdbState.fetchGenreMovies(identifier);
        }
      }
    );
  }

  getListByRouterParams = (): Observable<Partial<MoviesState>> => {
    return this.routerParams$.pipe(
      switchMap(({ identifier, type }) => {
        if (type === 'category') {
          return this.tmdbState.categoryMovieList$(identifier);
        } else if (type === 'genre') {
          return this.tmdbState.genreMovieList$(identifier);
        }
        return EMPTY;
      }),
      map(({ movies, title }) => ({
        loading: false,
        movies,
        title
      })),
      catchError((_: any) => {
        return of({ loading: false, movies: [], title: undefined });
      }),
      startWith({ loading: true })
    );
  };

}
