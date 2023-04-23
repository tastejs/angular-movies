import { RxState } from '@rx-angular/state';
import { selectSlice } from '@rx-angular/state/selections';
import { TMDBMovieModel } from '../../data-access/api/model/movie.model';
import { Injectable } from '@angular/core';
import { infiniteScroll } from '../../shared/cdk/infinite-scroll/infiniteScroll';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RouterState } from '../../shared/router/router.state';
import { combineLatestWith, map, switchMap, withLatestFrom } from 'rxjs';
import {SIZES, W300H450} from '../../data-access/api/constants/image-sizes';
import { ImageTag } from '../../shared/cdk/image/image-tag.interface';
import { addImageTag } from '../../shared/cdk/image/image-tag.transform';
import { getIdentifierOfTypeAndLayoutUtil } from '../../shared/router/get-identifier-of-type-and-layout.util';
import { TMDBPersonModel } from '../../data-access/api/model/person.model';
import { PersonState } from '../../shared/state/person.state';
import { WithContext } from '../../shared/cdk/context/context.interface';
import { MoviesSortValue } from '../../data-access/api/sort/sort.data';
import { DiscoverResource } from '../../data-access/api/resources/discover.resource';
import {BREAKPOINTS} from "../../shared/utils/breakpoints";
import {Movie} from "../../shared/state/movie.state";

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


/**
 * Person Detail Page - Hero img
 *
 * Screen: xs
 * <img>
 *  __
 * <p>
 *
 * Screen: s
 * <img>
 * __
 * <p>
 *
 * Screen: m
 * <img> | <p>
 *
 * Screen: l
 * <img> | <p>
 *
 * Screen: xl
 * <img> | <p>
 *
 */

export const PERSON_DETAIL_HERO_IMG_SIZE = `${BREAKPOINTS.xSmall} ${SIZES["342w"]}, ${BREAKPOINTS.small} ${SIZES["342w"]}, ${BREAKPOINTS.mobile} ${SIZES["185w"]}, ${BREAKPOINTS.isLargeDesktop} ${SIZES["500w"]}`;
/**
 * Pattern: Movie List - List Img
 *
 * Screen: xs
 * <img>
 *  __
 * <p>
 *
 * Screen: s
 * <img>
 * __
 * <p>
 *
 * Screen: m
 * <img> | <p>
 *
 * Screen: l
 * <img> | <p>
 *
 * Screen: xl
 * <img> | <p>
 *
 */
export const PERSON_DETAIL_RECOMMENDATION_LIST_IMG_SIZE = `${BREAKPOINTS.xSmall} ${SIZES["154w"]}, ${BREAKPOINTS.small} ${SIZES["185w"]}, ${BREAKPOINTS.mobile} ${SIZES["342w"]}, ${BREAKPOINTS.isLargeDesktop} ${SIZES["342w"]}`;


function transformToPersonDetail(_res: TMDBPersonModel): MoviePerson {
  return addImageTag(_res, { pathProp: 'profile_path', dims: W300H450, sizes: PERSON_DETAIL_HERO_IMG_SIZE });
}

function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, { pathProp: 'poster_path', dims: W300H450, sizes: PERSON_DETAIL_RECOMMENDATION_LIST_IMG_SIZE });
}

@Injectable({
  providedIn: 'root',
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {
  private readonly actions = new RxActionFactory<Actions>().create();
  readonly paginate = this.actions.paginate;
  readonly toggleSorting = this.actions.toggleSorting;
  readonly sortBy = this.actions.sortBy;
  readonly routerPersonId$ = this.routerState.select(
    getIdentifierOfTypeAndLayoutUtil('person', 'detail')
  );
  readonly sortingModel$ = this.select(
    selectSlice(['showSorting', 'activeSorting'])
  );
  readonly routedPersonCtx$ = this.routerPersonId$.pipe(
    switchMap(this.personState.personByIdCtx),
    map((ctx: WithContext<TMDBPersonModel>): WithContext<MoviePerson> => {
      ctx.value && ((ctx as any).value = transformToPersonDetail(ctx.value));
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
    map((v) => ({...v, results:  v.results?.map(transformToMovieModel)}))
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
    })
  );

  constructor(
    private routerState: RouterState,
    private personState: PersonState,
    private discoverResource: DiscoverResource
  ) {
    super();

    this.connect('showSorting', this.actions.toggleSorting$);
    this.connect(this.actions.sortBy$, (_, sortBy) => ({
      showSorting: false,
      activeSorting: sortBy.name,
    }));

    this.hold(this.routerPersonId$, this.personState.fetchPerson);
  }
}
