import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RxState, select } from '@rx-angular/state';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { MovieModel } from '../../data-access/model';
import { MovieList, StateService } from '../../shared/state/state.service';


type MoviesState = {
  loading: boolean;
  movies: MovieModel[];
  title: string;
};
type RouteParams = {
  category?: string;
  genre?: string;
};

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent extends RxState<MoviesState> {
  movies: MovieModel[] = [];

  readonly movies$ = this.select('movies');
  readonly loading$ = this.select('loading');
  readonly title$ = this.select('title');

  constructor(
    private tmdbState: StateService,
    private route: ActivatedRoute
  ) {
    super();
    this.connect(this.loadListByParam('category', category => this.tmdbState.moviesList$(category)));
    this.connect(this.loadListByParam('genre', genre => this.tmdbState.genresList$(genre)));

    this.hold(this.route.params.pipe(
      map(({ category, genre }: Record<string, string>) => {
        if (category) {
          this.tmdbState.fetchCategoryMovies(category);
        } else if (genre) {
          this.tmdbState.fetchGenreMovies(genre);
        }
      }))
    );
  }

  loadListByParam = (paramName: keyof RouteParams, fetch: (paramValue: string) => Observable<MovieList>): Observable<Partial<MoviesState>> => {
    return this.route.params.pipe(
      select(paramName),
      switchMap(paramValue => fetch(paramValue)
        .pipe(
          map(({ movies, title }) => ({
            loading: false,
            movies,
            title
          }))
        )
      ),

      catchError((_: any) => {
        return of({ loading: false, movies: [], title: undefined });
      }),
      startWith({ loading: true })
    );
  }

}

