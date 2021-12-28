import { MovieModel } from '../../data-access/model/movie.model';
import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { StateService } from '../../shared/state/state.service';
import { RouterStateService } from '../../shared/state/router-state.service';
import { combineLatest, map, startWith, switchMap } from 'rxjs';
import { W780H1170 } from '../../data-access/configurations/image-sizes';
import { ImageTag } from '../../shared/utils/image-object';
import { Tmdb2Service } from '../../data-access/api/tmdb2.service';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
import { MoviePersonModel } from '../../data-access/model/movie-person.model';

export type MoviePerson = MoviePersonModel & ImageTag;

export interface PersonDetailPageAdapterState {
  loading: boolean;
  person: MoviePerson;
  recommendations: MovieModel[];
}

function transformToMovieDetail(_res: MoviePersonModel): MoviePerson {
  const res = _res as MoviePerson;
  res.url = `https://image.tmdb.org/t/p/w${W780H1170.WIDTH}/${res.profile_path}`;
  res.imgWidth = W780H1170.WIDTH;
  res.imgHeight = W780H1170.HEIGHT;
  res.imgRatio = res.imgWidth / res.imgHeight;

  return res as MoviePerson;
}

@Injectable({
  providedIn: 'root'
})
export class PersonDetailAdapter extends RxState<PersonDetailPageAdapterState> {

  readonly routedPersonSlice$ = this.select(selectSlice(['person', 'loading']));
  readonly routerPersonId$ = this.routerState.select(getIdentifierOfTypeAndLayout('person', 'detail'));

  readonly movieRecomendationsById$ = this.routerPersonId$.pipe(
    switchMap((identifier) =>
      this.tmdb.getPersonMovies(identifier).pipe(
        map((res: any) => res.results),
        startWith([])
      )
    )
  );

  readonly movieCastById$ = this.routerPersonId$.pipe(
    switchMap((identifier) =>
      this.tmdb.getCredits(identifier).pipe(
        map((res: any) => res.cast || []),
        startWith([])
      )
    )
  );

  constructor(private globalState: StateService, private routerState: RouterStateService, private tmdb: Tmdb2Service) {
    super();
    this.connect(
      combineLatest({ id: this.routerPersonId$, globalSlice: this.globalState.select(selectSlice(['person', 'personContext'])) }).pipe(
        map(({ id, globalSlice }) => {
          const { person, personContext: loading } = globalSlice;
          return ({
            loading,
            person: person[id] !== undefined ? transformToMovieDetail(person[id]) : null
          }) as PersonDetailPageAdapterState;
        }))
    );
  }

}
