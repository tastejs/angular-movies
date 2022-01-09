import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { getActions } from '../../shared/rxa-custom/actions/index';
import { RouterState } from '../../shared/state/router.state';
import { map, switchMap } from 'rxjs';
import { W780H1170 } from '../../data-access/api/constants/image-sizes';
import { ImageTag } from '../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../shared/utils/image/image-tag.transform';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { TMDBPersonModel } from '../../data-access/api/model/person.model';
import { PersonState } from '../../shared/state/person.state';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';
import { WithContext } from '../../shared/cdk/context/context.interface';

export type MoviePerson = TMDBPersonModel & ImageTag;

export interface PersonDetailPageAdapterState {
  loading: boolean;
  person: MoviePerson;
  recommendations: TMDBMovieModel[];
}

function transformToPersonDetail(_res: TMDBPersonModel): MoviePerson {
  return addImageTag(_res, { pathProp: 'profile_path', dims: W780H1170 });
}

@Injectable({
  providedIn: 'root',
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {
  private readonly actions = getActions<{ paginate: void }>();
  readonly paginate = this.actions.paginate;
  readonly routerPersonId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('person', 'detail')
  );
  readonly routedPersonCtx$ = this.routerPersonId$.pipe(
    switchMap(this.personState.personByIdCtx),
    map((ctx) => {
      ctx.value && ((ctx as any).value = transformToPersonDetail(ctx.value));
      return ctx as unknown as WithContext<MoviePerson>;
    })
  );

  readonly movieRecommendationsById$ = this.routerPersonId$.pipe(
    switchMap((with_cast) => {
      return infiniteScroll(
        (options) => getDiscoverMovies({ with_cast, ...options }),
        this.actions.paginate$,
        getDiscoverMovies({ with_cast, page: 1 })
      );
    })
  );

  constructor(
    private routerState: RouterState,
    private personState: PersonState
  ) {
    super();
    this.hold(this.routerPersonId$, this.personState.fetchPerson);
  }
}
