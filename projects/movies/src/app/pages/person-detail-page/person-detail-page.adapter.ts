import { rxState } from '@rx-angular/state';
import { selectSlice } from '@rx-angular/state/selections';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { inject, Injectable } from '@angular/core';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { rxActions } from '@rx-angular/state/actions';
import { RouterState } from '../../shared/router/router.state';
import { combineLatestWith, map, switchMap, withLatestFrom } from 'rxjs';
import { W300H450 } from '../../data-access/images/image-sizes';
import { ImageTag } from '../../shared/cdk/image/image-tag.interface';
import { addImageTag } from '../../shared/cdk/image/image-tag.transform';
import { getIdentifierOfTypeAndLayoutUtil } from '../../shared/router/get-identifier-of-type-and-layout.util';
import { TMDBPersonModel } from '../../data-access/api/model/person.model';
import { PersonState } from '../../state/person.state';
import { WithContext } from '../../shared/cdk/loading/context.interface';
import { MoviesSortValue } from '../../data-access/api/sort/sort.data';
import { DiscoverResource } from '../../data-access/api/resources/discover.resource';

import { Movie } from '../../state/movie.state';
import { rxEffects } from '@rx-angular/state/effects';

export type MoviePerson = TMDBPersonModel & ImageTag;
export type Actions = {
  paginate: void;
  toggleSorting: boolean;
  sortBy: MoviesSortValue;
};

export interface PersonDetailPageAdapterState {
  loading: boolean;
  person: MoviePerson;
  recommendations: TMDBMovieModel[];
  showSorting: boolean;
  activeSorting: string;
}

function transformToPersonDetail(_res: TMDBPersonModel): MoviePerson {
  return addImageTag(_res, {
    pathProp: 'profile_path',
    dims: W300H450,
    sizes: `(min-width: 901px) 15vw, 42vw`,
    srcset: '154w, 185w, 342w, 500w, 780w',
  });
}

function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res, {
    pathProp: 'poster_path',
    dims: W300H450,
    sizes: '(min-width: 600px) 21vw, 15vw',
    srcset: '185w, 342w',
  });
}

@Injectable({
  providedIn: 'root',
})
export class PersonDetailAdapter {
  private readonly routerState = inject(RouterState);
  private readonly personState = inject(PersonState);
  private readonly discoverResource = inject(DiscoverResource);
  private readonly state = rxState<PersonDetailPageAdapterState>(
    ({ connect }) => {
      connect('showSorting', this.actions.toggleSorting$);
      connect(this.actions.sortBy$, (_, sortBy) => ({
        showSorting: false,
        activeSorting: sortBy.name,
      }));
    }
  );
  private readonly actions = rxActions<Actions>();
  readonly set = this.state.set;
  readonly paginate = this.actions.paginate;
  readonly toggleSorting = this.actions.toggleSorting;
  readonly sortBy = this.actions.sortBy;
  readonly routerPersonId$ = this.routerState.select(
    getIdentifierOfTypeAndLayoutUtil('person', 'detail')
  );
  readonly sortingModel$ = this.state.select(
    selectSlice(['showSorting', 'activeSorting'])
  );
  readonly routedPersonCtx$ = this.routerPersonId$.pipe(
    switchMap(this.personState.personByIdCtx),
    map((ctx: WithContext<TMDBPersonModel>): WithContext<MoviePerson> => {
      ctx.value &&
        ((ctx as unknown as { value: unknown }).value = transformToPersonDetail(
          ctx.value
        ));
      return ctx as unknown as WithContext<MoviePerson>;
    })
  );

  readonly movieRecommendationsById$ = this.routerPersonId$.pipe(
    combineLatestWith(this.routerState.select('sortBy')),
    switchMap(([with_cast, sort_by]) => {
      return infiniteScroll(
        (options) =>
          this.discoverResource.getDiscoverMovies({
            with_cast,
            ...options,
            sort_by,
          }),
        this.actions.paginate$,
        this.discoverResource.getDiscoverMovies({ with_cast, page: 1, sort_by })
      );
    }),
    map((v) => ({ ...v, results: v.results?.map(transformToMovieModel) }))
  );

  readonly sortingEvent$ = this.actions.sortBy$.pipe(
    withLatestFrom(this.routerPersonId$),
    switchMap(([{ value }, with_cast]) => {
      return infiniteScroll(
        (options) =>
          this.discoverResource.getDiscoverMovies({
            with_cast,
            ...options,
            sort_by: value,
          }),
        this.actions.paginate$,
        this.discoverResource.getDiscoverMovies({
          with_cast,
          page: 1,
          sort_by: value,
        })
      );
    }),
    map((v) => ({ ...v, results: v.results?.map(transformToMovieModel) }))
  );

  constructor() {
    rxEffects((e) =>
      e.register(this.routerPersonId$, this.personState.fetchPerson)
    );
  }
}
