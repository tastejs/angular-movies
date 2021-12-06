import { Injectable } from '@angular/core';
import { catchError, exhaustMap, filter, map, Observable, startWith, Subject, switchMap, withLatestFrom } from 'rxjs';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, select, selectSlice } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { parseTitle } from '../utils/parse-movie-list-title';
import { NavigationEnd, Router } from '@angular/router';

type RouterParams = {
  type: 'genre' | 'category';
  identifier: string;
};

interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
}

interface Command<T extends commandNames, P = any> {
  type: T;
  payload?: P;
}

export interface MovieList {
  loading: boolean;
  title: string;
  movies: MovieModel[];
}

type commandNames = 'refreshGenres' | 'fetchCategoryMovies' | 'fetchGenreMovies';
type refreshGenres = Command<'refreshGenres'>;
type fetchCategoryMovies = Command<'fetchCategoryMovies', string>;
type fetchGenreMovies = Command<'fetchGenreMovies', string | number>;

type commands = refreshGenres | fetchCategoryMovies | fetchGenreMovies;

@Injectable({
  providedIn: 'root'
})
export class StateService extends RxState<State> {
  private commands = new Subject<commands>();

  private routerParams$: Observable<RouterParams> = this.router.events
    .pipe(
      select(
        filter(event => event instanceof NavigationEnd),
        map(_ => {
          const [__, page, type, identifier] = this.router.routerState.snapshot.url.split('/');
          return { page, type, identifier };
        }),
        selectSlice(['identifier', 'type'])
      )
    ) as unknown as Observable<RouterParams>;
  routerGenre$ = this.routerParams$.pipe(filter(({ type }) => type === 'genre'), map(({ identifier }) => identifier));
  routerCategory$ = this.routerParams$.pipe(filter(({ type }) => type === 'category'), map(({ identifier }) => identifier));

  genresNames$ = this.select('genres');
  genreMovieList$ = this.select(
    selectSlice(['genres', 'genreMovies', 'genreMoviesContext']),
    withLatestFrom(this.routerGenre$),
    map(([{ genres, genreMovies, genreMoviesContext }, genreParam]) => {
      const genreIdStr = genreParam as unknown as string;
      const genreId = parseInt(genreIdStr, 10);
      const genreName = genres.find((g: MovieGenreModel) => g.id === genreId)?.name || 'unknown genre';
      return {
        loading: genreMoviesContext,
        title: parseTitle(genreName),
        movies: genreMovies && genreMovies[genreIdStr] || []
      };
    })
  );

  categoryMovieList$: Observable<MovieList> = this.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    withLatestFrom(this.routerCategory$),
    map(([{ categoryMovies, categoryMoviesContext }, listName]) => {
        return ({
          loading: categoryMoviesContext,
          title: parseTitle(listName),
          movies: categoryMovies && categoryMovies[listName] || []
        });
      }
    )
  );

  routedMovieList$ = this.routerParams$.pipe(
    switchMap(({ type }) => type === 'genre' ? this.genreMovieList$ : this.categoryMovieList$)
  );

  constructor(private tmdb2Service: Tmdb2Service, private router: Router) {
    super();
    this.connect('genres', this.commands.pipe(
      filter(({ type }) => type === 'refreshGenres'),
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => this.tmdb2Service.getGenres()))
    );

    this.connect(
      this.commands.pipe(
        filter(({ type }) => type === 'fetchCategoryMovies'),
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          ({ payload: category }) => 'category' + '-' + category,
          ({ payload: category }) => this.tmdb2Service.getMovieCategory(category)
            .pipe(
              map(({ results }) => ({ categoryMoviesContext: false, categoryMovies: { [category]: results } })),
              startWith({ categoryMoviesContext: true }),
              catchError(_ => ([{ categoryMoviesContext: true }]))
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.categoryMovies = patch(oldState?.categoryMovies, resultState.categoryMovies);
        return resultState;
      }
    );

    this.connect(
      this.commands.pipe(
        filter(({ type }) => type === 'fetchGenreMovies'),
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         */
        optimizedFetch(
          ({ payload: genre }) => 'genre' + '-' + genre,
          ({ payload: genre }) => this.tmdb2Service.getMovieGenre(genre)
            .pipe(
              map(({ results }) => ({ genreMoviesContext: false, genreMovies: { [genre]: results } })),
              startWith({ genreMoviesContext: true }),
              catchError(_ => ([{ genreMoviesContext: true }]))
            )
        )
      ),
      (oldState, newPartial) => {
        let s = newPartial as unknown as State;
        let resultState = patch(oldState, s);
        resultState.genreMovies = patch(oldState.genreMovies, resultState.genreMovies);
        return resultState;
      }
    );

    this.hold(this.routerParams$, this.routerFetchEffect);
  }

  init(): void {
    this.refreshGenres();
    this.fetchCategoryMovies('popular');
  }

  refreshGenres(): void {
    this.commands.next({ type: 'refreshGenres', payload: null });
  }

  fetchCategoryMovies(category: string): void {
    this.commands.next({ type: 'fetchCategoryMovies', payload: category });
  }

  fetchGenreMovies(genre: string | number): void {
    this.commands.next({ type: 'fetchGenreMovies', payload: genre });
  }

  private routerFetchEffect = ({ type, identifier }: RouterParams) => {
    if (type === 'category') {
      this.fetchCategoryMovies(identifier);
    } else if (type === 'genre') {
      this.fetchGenreMovies(identifier);
    }
  };

}
