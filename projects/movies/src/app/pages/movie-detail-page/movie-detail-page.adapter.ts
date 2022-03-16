import { RxState } from '@rx-angular/state';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { RouterState } from '../../shared/router/router.state';
import { MovieState } from '../../shared/state/movie.state';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import {
  getCredits,
  getMoviesRecommendations,
} from '../../data-access/api/resources/movie.resource';
import {
  transformToCastList,
  transformToMovieDetail,
} from './selection/client-movie-detail.mapper';
import { RxActionFactory } from '../../shared/rxa-custom/actions';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { MovieDetail } from './selection/movie-detail.model';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';
import { MovieCast } from './selection/movie-cast.model';

type Actions = { paginateRecommendations: void };
@Injectable({
  providedIn: 'root',
})
export class MovieDetailAdapter extends RxState<any> {
  private readonly actions = new RxActionFactory<Actions>().create();
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

  readonly movieCastById$: Observable<WithContext<MovieCast[]>> =
    this.routerMovieId$.pipe(
      switchMap((id) =>
        getCredits(id).pipe(
          map(({ cast }) => ({ value: cast.map(transformToCastList) }))
        )
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
