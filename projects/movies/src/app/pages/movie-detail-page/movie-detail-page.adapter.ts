import { Injectable } from '@angular/core';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { RxState, selectSlice } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { MovieState } from '../../shared/state/movie.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { getCredits, getMoviesRecommendations } from '../../data-access/api/resources/movie.resource';
import { MovieDetailPageModel } from './selection/movie-detail-page.model';
import { transformToMovieDetail } from './selection/client-movie-detail.mapper';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailAdapter extends RxState<MovieDetailPageModel> {
  routedMovieSlice$ = this.select(selectSlice(['movie', 'loading']));
  routerMovieId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('movie', 'detail')
  );

  movieRecomendationsById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      getMoviesRecommendations(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  movieCastById$ = this.routerMovieId$.pipe(
    switchMap((identifier) =>
      getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(
    private movieState: MovieState,
    private routerState: RouterState) {
    super();
    this.connect(
      combineLatest({
        id: this.routerMovieId$,
        globalSlice: this.movieState.select(
          selectSlice(['movies', 'moviesLoading'])
        )
      }).pipe(
        map(({ id, globalSlice }) => {
          const { movies, moviesLoading: loading } = globalSlice;
          return {
            loading,
            movie:
              movies[id] !== undefined
                ? transformToMovieDetail(movies[id])
                : null
          } as MovieDetailPageModel;
        })
      )
    );
  }
}
