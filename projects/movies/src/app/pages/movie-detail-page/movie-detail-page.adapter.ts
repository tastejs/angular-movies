import { RxState } from '@rx-angular/state';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { RouterState } from '../../shared/router/router.state';
import { MovieState } from '../../state/movie.state';
import { getIdentifierOfTypeAndLayoutUtil } from '../../shared/router/get-identifier-of-type-and-layout.util';
import { MovieResource } from '../../data-access/api/resources/movie.resource';

import { RxActionFactory } from '@rx-angular/state/actions';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';

import { WithContext } from '../../shared/cdk/loading/context.interface';
import { withLoadingEmission } from '../../shared/cdk/loading/withLoadingEmissions';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { addVideoTag } from '../../shared/cdk/video/video-tag.transform';
import { addImageTag } from '../../shared/cdk/image/image-tag.transform';
import {
  W154H205,
  W300H450,
  W44H66,
} from '../../data-access/images/image-sizes';
import { addLinkTag } from '../../shared/cdk/link/a-tag.transform';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { Movie } from '../../state/movie.state';
import { TMDBMovieDetailsModel } from '../../data-access/api/model/movie-details.model';
import { LinkTag } from '../../shared/cdk/link/a-tag.interface';
import { ImageTag } from '../../shared/cdk/image/image-tag.interface';
import { VideoTag } from '../../shared/cdk/video/video.interface';

type Actions = { paginateRecommendations: void };

@Injectable({
  providedIn: 'root',
})
export class MovieDetailAdapter extends RxState<any> {
  private readonly movieState = inject(MovieState);
  private readonly routerState = inject(RouterState);
  private readonly movieResource = inject(MovieResource);
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
    map((v) => ({ ...v, results: v?.results?.map(transformToMovieModel) }))
  );

  constructor() {
    super();
    this.hold(this.routerMovieId$, this.movieState.fetchMovie);
  }
}

export type MovieDetail = TMDBMovieDetailsModel &
  LinkTag &
  ImageTag &
  VideoTag & { languages_runtime_release: string };

export type MovieCast = TMDBMovieCastModel & ImageTag;

export function transformToMovieDetail(_res: TMDBMovieModel): MovieDetail {
  const res = _res as unknown as MovieDetail;
  let language: string | boolean = false;
  if (
    Array.isArray(res?.spoken_languages) &&
    res?.spoken_languages.length !== 0
  ) {
    language = res.spoken_languages[0].english_name;
  }
  res.languages_runtime_release = `${language + ' / ' || ''} ${
    res.runtime
  } MIN. / ${new Date(res.release_date).getFullYear()}`;

  addVideoTag(res, { pathPropFn: (r: any) => r?.videos?.results[0]?.key + '' });
  addImageTag(res, {
    pathProp: 'poster_path',
    dims: W300H450,
    sizes: `(min-width: 901px) 15vw, 42vw`,
    srcset: '154w, 185w, 342w, 500w, 780w',
  });
  addLinkTag(res, 'imdb_id', {});
  return res as MovieDetail;
}

export function transformToCastList(_res: TMDBMovieCastModel): MovieCast {
  const res = _res as unknown as MovieCast;
  addImageTag(res, {
    pathProp: 'profile_path',
    dims: W44H66,
    sizes: `44px`,
    srcset: '154w',
  });
  return res;
}

export function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, {
    pathProp: 'poster_path',
    dims: W154H205,
    sizes: '(min-width: 600px) 21vw, 15vw',
    srcset: '185w, 342w',
  });
}
