import { Injectable } from '@angular/core';
import { insert, RxState, selectSlice } from '@rx-angular/state';
import { distinctUntilKeyChanged, EMPTY, filter, map, Observable, Subject, switchMap, withLatestFrom } from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { getMovieCategory } from '../../data-access/api/resources/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { TMDBPaginationOptions } from '../../data-access/api/model/pagination.interface';
import { DiscoverState } from '../../shared/state/discover.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { infiniteScrolled, InfiniteScrolleState, PaginationOptions } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { RouterParams } from '../../shared/state/router-state.interface';
import { PaginatedResult } from '../../shared/state/typings';

type MovieListRouterParams = Pick<RouterParams, 'type' | 'identifier'>
type MovieListPageModel = InfiniteScrolleState<TMDBMovieModel> & MovieListRouterParams;

function listChanged(oldP: any, newP: any): boolean {
  return oldP?.type !== newP?.type || oldP?.identifier !== newP?.identifier;
}

function getFetchByType(type: RouterParams['type']): (i: string, options?: TMDBPaginationOptions) => Observable<PaginatedResult<TMDBMovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'genre' || type === 'search') {
    return getDiscoverMovies;
  }
  return (_: string, __?: TMDBPaginationOptions) => EMPTY as unknown as Observable<PaginatedResult<TMDBMovieModel>>;
}

@Injectable({
  providedIn: 'root'
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {

  private readonly paginate$ = new Subject<void>();

  private readonly initialCategoryMovieList$ = (identifier: string) => this.movieState.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    // only forward if loading is finished and items are present
    filter(({ categoryMovies, categoryMoviesContext }) => !categoryMoviesContext && Array.isArray(categoryMovies[identifier]?.results)),
    map(
      ({ categoryMovies: idMap, categoryMoviesContext: loading }) => {
        // Add loading and if results is empty set it to null
        return ({ loading, ...((idMap && idMap[identifier]) || { results: [] }) }) as MovieListPageModel;
      }
    )
  );
  private readonly initialDiscoverMovieList$: (i: string) => Observable<MovieListPageModel> = (indentifier: string) => this.discoverState.select(
    selectSlice(['discoveredMovies', 'discoveredMoviesContext']),
    // only forward if loading is finished and items are present
    filter(({ discoveredMovies, discoveredMoviesContext }) => !discoveredMoviesContext && Array.isArray(discoveredMovies[indentifier]?.results)),
    map(
      ({ discoveredMovies: idMap, discoveredMoviesContext: loading }) =>
        // Add loading and if results is empty set it to null
        ({ loading, ...((idMap && idMap[indentifier]) || { results: [] }) }) as MovieListPageModel
    )
  );

  constructor(
    private movieState: MovieState,
    private discoverState: DiscoverState,
    private routerState: RouterState
  ) {
    super();
    this.set({
      // to render something to trigger render callback
    });

    const routerParamsFromPaginationTrigger$: Observable<MovieListRouterParams> = this.paginate$.pipe(
      withLatestFrom(this.routerState.routerParams$),
      map(([_, routerParams]) => routerParams)
    );

    // paginated results as container state
    this.connect(
      this.routerState.routerParams$.pipe(
        // we clear the current result on route change with switchMap and startWit
        distinctUntilKeyChanged('identifier'),
        switchMap(({ type, identifier }) => {
          console.log('switch to ', type, identifier);
          return infiniteScrolled(
            (paginationOptions: PaginationOptions, { type, identifier }) => {
              // @TODO type correctly
              const z = getFetchByType(type)(identifier, paginationOptions).pipe(
                map((r) => ({ ...r, type, identifier }))
              );
              return z;
            },
            routerParamsFromPaginationTrigger$,
            (type === 'category' ? this.initialCategoryMovieList$(identifier) : this.initialDiscoverMovieList$(identifier)).pipe(
              map((r) => ({ ...r, type, identifier }))
            )
          );
          // .pipe(startWith({ results: [], identifier, type } as unknown as InfiniteScrolleState<TMDBMovieModel>));
        })
      ),
      (oldState, newSlice) => {
        if (newSlice?.results) {
          console.log('old results:', oldState, 'newSlice: ', newSlice, listChanged(oldState, newSlice));
          if(listChanged(oldState, newSlice)) {
            newSlice.results = newSlice.results;
          } else {
            newSlice.results = insert((oldState as any)?.results, newSlice.results);
          }
        }

        return newSlice;
      }
    );
  }

  paginate() {
    this.paginate$.next();
  }
}
