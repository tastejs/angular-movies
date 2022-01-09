import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { MovieState } from '../../shared/state/movie.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import {
  getCredits,
  getMoviesRecommendations,
} from '../../data-access/api/resources/movie.resource';
import { transformToMovieDetail } from './selection/client-movie-detail.mapper';
import { getActions } from '../../shared/rxa-custom/actions';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { MovieDetail } from './selection/movie-detail.model';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailAdapter extends RxState<any> {
  private readonly actions = getActions<{ paginateRecommendations: void }>();
  readonly paginateRecommendations = this.actions.paginateRecommendations;

  readonly routerMovieId$: Observable<string> = this.routerState.select(
    getIdentifierOfTypeAndLayout('movie', 'detail')
  );

  readonly routedMovieCtx$ = this.routerMovieId$.pipe(
    switchMap(this.movieState.movieByIdCtx),
    map((ctx) => {
      ctx.value && ((ctx as any).value = transformToMovieDetail(ctx.value));
      return ctx as unknown as WithContext<MovieDetail>;
    })
  );

  readonly movieCastById$: Observable<WithContext<TMDBMovieCastModel[]>> =
    this.routerMovieId$.pipe(
      switchMap((id) =>
        getCredits(id).pipe(map(({ cast: value }) => ({ value })))
      ),
      withLoadingEmission()
    );

  readonly infiniteScrollRecommendations$ = this.routerMovieId$.pipe(
    switchMap((id) =>
      infiniteScroll(
        (incrementedParams) => getMoviesRecommendations(id, incrementedParams),
        this.actions.paginateRecommendations$,
        getMoviesRecommendations(id, { page: 1 })
      )
    )
  );

  constructor(
    private movieState: MovieState,
    private routerState: RouterState
  ) {
    super();
    this.hold(this.routerMovieId$, this.movieState.fetchMovie);
  }
}
