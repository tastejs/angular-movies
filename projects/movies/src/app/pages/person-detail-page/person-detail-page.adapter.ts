import { TMDBMovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { RouterState } from '../../shared/state/router.state';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { ImageTag } from '../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../shared/utils/image/image-tag.transform';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { TMDBMoviePersonModel } from '../../data-access/model/movie-person.model';
import { PersonState } from '../../shared/state/person.state';
import { getCredits } from '../../data-access/api/movie.resource';
import { getDiscoverMovies } from '../../data-access/api/discover.resource';

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
  providedIn: 'root'
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {

  readonly routedPersonSlice$ = this.select(selectSlice(['person', 'loading']));
  readonly routerPersonId$ = this.routerState.select(getIdentifierOfTypeAndLayout('person', 'detail'));

  readonly movieRecommendationsById$ = this.routerPersonId$.pipe(
    switchMap((identifier) =>
      getDiscoverMovies(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  readonly movieCastById$ = this.routerPersonId$.pipe(
    switchMap((identifier) =>
      getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(private routerState: RouterState,
              private personState: PersonState) {
    super();
    this.connect(
      combineLatest({ id: this.routerPersonId$, globalSlice: this.personState.select(selectSlice(['person', 'personContext'])) }).pipe(
        map(({ id, globalSlice }) => {
          const { person, personContext: loading } = globalSlice;
          return ({
            loading,
            person: person[id] !== undefined ? transformToPersonDetail(person[id]) : null
          }) as PersonDetailPageAdapterState;
        }))
    );
  }

}
