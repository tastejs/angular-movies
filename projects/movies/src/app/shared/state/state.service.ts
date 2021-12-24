import { Injectable } from '@angular/core';
import { exhaustMap, filter, map, Observable, OperatorFunction, pipe, startWith, switchMap, withLatestFrom } from 'rxjs';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { MovieModel } from '../../data-access/model/movie.model';
import { patch, RxState, select, selectSlice } from '@rx-angular/state';
import { optimizedFetch } from '../utils/optimized-fetch';
import { parseTitle } from '../utils/parse-movie-list-title';
import { NavigationEnd, Router } from '@angular/router';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';

type RouterParams = {
  type: 'genre' | 'category';
  identifier: string;
};

const getIdentifierOfType = (filterType: string): OperatorFunction<RouterParams, string> => {
  return pipe(
    filter(({ type }: RouterParams) => type === filterType), map(({ identifier }) => identifier)
  )
}

interface State {
  genres: MovieGenreModel[];
  genreMovies: Record<string, MovieModel[]>;
  genreMoviesContext: boolean;
  categoryMovies: Record<string, MovieModel[]>;
  categoryMoviesContext: boolean;
}

export interface MovieList {
  loading: boolean;
  title: string;
  movies: MovieModel[];
}

interface Actions {
  refreshGenres: void;
  fetchCategoryMovies: string;
  fetchGenreMovies: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class StateService extends RxState<State> {
  readonly actions = getActions<Actions>();

  private readonly routerParams$: Observable<RouterParams> = this.router.events
    .pipe(
      select(
        filter(event => event instanceof NavigationEnd),
        startWith('anyValue'),
        map(_ => {
          // This is a naive way to reduce scripting of router service :)
          // Obviously the params ane not properly managed
          const [type, identifier] = window.location.href.split('/').slice(-2);
          return { type, identifier };
        }),
        selectSlice(['identifier', 'type'])
      )
    ) as unknown as Observable<RouterParams>;
  readonly routerGenre$ = this.routerParams$.pipe(getIdentifierOfType('genre'));
  readonly routerCategory$ = this.routerParams$.pipe(getIdentifierOfType('category'));

  readonly genresNames$ = this.select('genres');
  readonly genreMovieList$ = this.select(
    selectSlice(['genres', 'genreMovies', 'genreMoviesContext']),
    withLatestFrom(this.routerGenre$),
    map(([{ genres, genreMovies, genreMoviesContext }, genreParam]) => {
      const genreIdStr = genreParam as unknown as string;
      const genreId = parseInt(genreIdStr, 10);
      const genreName = genres.find((g: MovieGenreModel) => g.id === genreId)?.name || 'unknown genre';
      return {
        loading: genreMoviesContext,
        title: parseTitle(genreName),
        movies: genreMovies && genreMovies[genreIdStr] || null
      };
    })
  );

  readonly categoryMovieList$: Observable<MovieList> = this.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    withLatestFrom(this.routerCategory$),
    map(([{ categoryMovies, categoryMoviesContext }, listName]) => {
        return ({
          loading: categoryMoviesContext,
          title: parseTitle(listName),
          movies: categoryMovies && categoryMovies[listName] || null
        });
      }
    )
  );

  routedMovieList$ = this.routerParams$.pipe(
    switchMap(({ type }) => type === 'genre' ? this.genreMovieList$ : this.categoryMovieList$)
  );

  constructor(private tmdb2Service: Tmdb2Service, private router: Router) {
    super();
    this.set({
      categoryMovies: {},
      genreMovies: {}
    })
  }

  /**
   * @TODO Add comment regards chunking
   */
  init = () => setTimeout(() => {
      this.connect('genres', this.actions.refreshGenres$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         * E.G.: URLs with the same params
         */
        exhaustMap(() => this.tmdb2Service.getGenres()))
      );

      this.connect(
        this.actions.fetchCategoryMovies$.pipe(
          /**
           * **🚀 Perf Tip for TTI, TBT:**
           *
           * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
           */
          optimizedFetch(
            (category) => 'category' + '-' + category,
            (category) => this.tmdb2Service.getMovieCategory(category)
              .pipe(
                map(({ results }) => ({ categoryMovies: { [category]: results } } as State)),
                withLoadingEmission('categoryMoviesContext', true, false)
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
        this.actions.fetchGenreMovies$.pipe(
          /**
           * **🚀 Perf Tip for TTI, TBT:**
           *
           * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
           */
          optimizedFetch(
            (genre) => 'genre' + '-' + genre,
            (genre) => this.tmdb2Service.getMovieGenre(genre + '')
              .pipe(
                map(({ results }) => ({ genreMovies: { [genre]: results } } as State)),
                withLoadingEmission('genreMoviesContext', true, false)
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

      this.refreshGenres();
      // movie lists are initialized over the route
      // this.fetchCategoryMovies('popular');
    })


  refreshGenres = this.actions.refreshGenres;

  fetchCategoryMovies = this.actions.fetchCategoryMovies

  fetchGenreMovies = this.actions.fetchGenreMovies

  private routerFetchEffect = ({ type, identifier }: RouterParams) => {
    if (type === 'category') {
      this.fetchCategoryMovies(identifier);
    } else if (type === 'genre') {
      this.fetchGenreMovies(identifier);
    }
  };

}
