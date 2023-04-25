import { RxState } from '@rx-angular/state';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { RouterState } from '../../shared/router/router.state';
import { MovieState} from '../../state/movie.state';
import { getIdentifierOfTypeAndLayoutUtil } from '../../shared/router/get-identifier-of-type-and-layout.util';
import { MovieResource } from '../../data-access/api/resources/movie.resource';
import {
  transformToMovieDetail,
  transformToCastList, transformToMovieModel,
} from './utils/client-movie-detail.mapper';
import { RxActionFactory } from '@rx-angular/state/actions';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { MovieDetail } from './utils/movie-detail.model';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';
import { MovieCast } from './utils/movie-cast.model';
type Actions = { paginateRecommendations: void };


@Injectable({
  providedIn: 'root',
})
export class MovieDetailAdapter extends RxState<any> {
  private readonly actions = new RxActionFactory<Actions>().create();
  readonly paginateRecommendations = this.actions.paginateRecommendations;

  readonly routerMovieId$: Observable<string> = this.routerState.select(
    getIdentifierOfTypeAndLayoutUtil('movie', 'detail')
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
        this.movieResource
          .getCredits(id)
          .pipe(map(({ cast }) => ({ value: cast.map(transformToCastList) })))
      ),
      withLoadingEmission()
    );

  readonly infiniteScrollRecommendations$ = this.routerMovieId$.pipe(
    switchMap((id) =>
      infiniteScroll(
        (incrementedParams) =>
          this.movieResource.getMoviesRecommendations(id, incrementedParams),
        this.actions.paginateRecommendations$,
        this.movieResource.getMoviesRecommendations(id, { page: 1 })
      )
    ),
    map((v) => ({...v, results: v?.results?.map(transformToMovieModel)}))
  );

  constructor(
    private movieState: MovieState,
    private routerState: RouterState,
    private movieResource: MovieResource
  ) {
    super();
    this.hold(this.routerMovieId$, this.movieState.fetchMovie);
  }
}
