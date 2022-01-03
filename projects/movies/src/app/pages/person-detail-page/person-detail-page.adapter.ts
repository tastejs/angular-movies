import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { infiniteScrolled } from '../../shared/cdk/infinite-scroll/infinite-scrolled';
import { getActions } from '../../shared/rxa-custom/actions/index';
import { RouterState } from '../../shared/state/router.state';
import { combineLatest, map, switchMap } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { ImageTag } from '../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../shared/utils/image/image-tag.transform';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { TMDBMoviePersonModel } from '../../data-access/api/model/movie-person.model';
import { PersonState } from '../../shared/state/person.state';
import { getDiscoverMovies } from '../../data-access/api/resources/discover.resource';

export type MoviePerson = TMDBMoviePersonModel & ImageTag;

export interface PersonDetailPageAdapterState {
  loading: boolean;
  person: MoviePerson;
  recommendations: TMDBMovieModel[];
}

function transformToPersonDetail(_res: TMDBMoviePersonModel): MoviePerson {
  return addImageTag(_res, { pathProp: 'profile_path', dims: W780H1170 });
}

@Injectable({
  providedIn: 'root',
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {
  private readonly actions = getActions<{ paginate: void }>();
  readonly paginate = this.actions.paginate;

  readonly routedPersonSlice$ = this.select(selectSlice(['person', 'loading']));
  readonly routerPersonId$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('person', 'detail')
  );

  readonly movieRecommendationsById$ = this.routerPersonId$.pipe(
    switchMap((with_case) =>
      infiniteScrolled(
        (options) => getDiscoverMovies({ with_case, ...options }),
        this.actions.paginate$,
        getDiscoverMovies({ with_case, page: 1 })
      )
    )
  );

  constructor(
    private routerState: RouterState,
    private personState: PersonState
  ) {
    super();
    this.connect(
      combineLatest({
        id: this.routerPersonId$,
        globalSlice: this.personState.select(
          selectSlice(['person', 'personLoading'])
        ),
      }).pipe(
        map(({ id, globalSlice }) => {
          const { person, personLoading: loading } = globalSlice;
          return {
            loading,
            person:
              person[id] !== undefined
                ? transformToPersonDetail(person[id])
                : null,
          } as PersonDetailPageAdapterState;
        })
      )
    );
  }
}
