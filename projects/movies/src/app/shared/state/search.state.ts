import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { MovieModel } from '../../data-access/model/movie.model';
import { RxState } from '@rx-angular/state';
import { getActions } from '../rxa-custom/actions';
import { withLoadingEmission } from '../utils/withLoadingEmissions';
import { SearchResource } from '../../data-access/api/search.resource';

export interface State {
  search: MovieModel[];
  searchContext: boolean;
}

interface Actions {
  fetchSearchMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchState extends RxState<State> {
  private actions = getActions<Actions>();

  constructor(private searchResource: SearchResource) {
    super();

    this.connect(
      this.actions.fetchSearchMovies$.pipe(
        switchMap((query) => this.searchResource.getMovies(query)
          .pipe(
            map(({ results }) => ({ search: results } as State)),
            withLoadingEmission('searchContext', true, false)
          )
        )
      )
    );
  }

  fetchSearchMovies = this.actions.fetchSearchMovies;

}
