import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { distinctUntilKeyChanged, EMPTY, map, Observable, startWith, Subject, switchMap, withLatestFrom } from 'rxjs';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { getMovieCategory } from '../../data-access/api/resources/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { TMDBPaginationOptions } from '../../data-access/api/model/pagination.interface';
import { DiscoverState } from '../../shared/state/discover.state';
import { MovieState } from '../../shared/state/movie.state';
import { RouterState } from '../../shared/state/router.state';
import { PaginationState } from '../../shared/utils/infinite-scroll/paginate-state.interface';
import { infiniteScrolled, PaginationOptions } from '../../shared/utils/infinite-scroll/infinite-scrolled';
import { RouterParams } from '../../shared/state/router-state.interface';
import { PaginatedResult } from '../../shared/state/typings';

type MovieListPageModel = PaginationState<TMDBMovieModel> &
  {
    type: string;
    identifier: string;
  };

function getFetchByType(type: RouterParams['type']): (i: string, options?: TMDBPaginationOptions) => Observable<PaginatedResult<TMDBMovieModel>> {
  if (type === 'category') {
    return getMovieCategory;
  } else if (type === 'genre' || type === 'search') {
    return getDiscoverMovies;
  }
  return (_: string, __?: TMDBPaginationOptions) => EMPTY as unknown as Observable<PaginationState<TMDBMovieModel>>;
}

@Injectable({
  providedIn: 'root'
})
export class MovieListPageAdapter extends RxState<MovieListPageModel> {

  private readonly paginate$ = new Subject<void>();

  private readonly initialCategoryMovieList$ = (indentifier: string) => this.movieState.select(
    selectSlice(['categoryMovies', 'categoryMoviesContext']),
    map(
      ({ categoryMovies: idMap, categoryMoviesContext: loading }) =>
        // Add loading and if results is empty set it to null
        ({ loading, ...((idMap && idMap[indentifier]) || { results: null }) })
    )
  );
  private readonly initialDiscoverMovieList$ = (indentifier: string) => this.discoverState.select(
    selectSlice(['discoveredMovies', 'discoveredMoviesContext']),
    map(
      ({ discoveredMovies: idMap, discoveredMoviesContext: loading }) =>
        // Add loading and if results is empty set it to null
        ({ loading, ...((idMap && idMap[indentifier]) || { results: null }) })
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
      results: []
    });

    const routerParamsFromPaginationTrigger$ = this.paginate$.pipe(
      withLatestFrom(this.routerState.routerParams$),
      map(([_, routerParams]) => routerParams)
    );

    // paginated results as container state
    this.connect(
      this.routerState.routerParams$.pipe(
        // we clear the current result on route change with switchMap and startWit
        distinctUntilKeyChanged('type'),
        switchMap(({ type, identifier }) => {
          return infiniteScrolled(
            routerParamsFromPaginationTrigger$,
            (paginationOptions: PaginationOptions, { type, identifier }) => {
              // @TODO type correctly
              return getFetchByType(type)(identifier, paginationOptions);// .pipe(withLoadingEmission())
            },
            type === 'category' ? this.initialDiscoverMovieList$(identifier) : this.initialCategoryMovieList$(identifier)
          ).pipe(startWith({results: []}));
        })
      ),
      ({ results }, newSlice) => {
        if (newSlice?.results) {
          newSlice.results = results.concat(newSlice.results);
        }
        return newSlice;
      }
    );
  }

  paginate() {
    this.paginate$.next();
  }
}
