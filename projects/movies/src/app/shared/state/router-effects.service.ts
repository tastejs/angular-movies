import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { StateService } from './state.service';
import { RouterParams, RouterStateService } from './router-state.service';

/**
 * This service manages data fetching based on router params
 */
@Injectable({
  providedIn: 'root'
})
export class RouterEffectsService extends RxState<any> {

  constructor(private routerState: RouterStateService, private state: StateService) {
    super();
  }

  init = () => this.hold(this.routerState.routerParams$, this.routerFetchEffect);

  private routerFetchEffect = ({ layout, type, identifier }: RouterParams) => {
    if (type === 'category') {
      this.state.fetchCategoryMovies(identifier);
    } else if (type === 'genre') {
      this.state.fetchGenreMovies(identifier);
    } else if (type === 'search') {
      this.state.fetchSearchMovies(identifier);
    }

    if(layout === 'detail' && type === 'movie') {
      this.state.fetchMovie(identifier)
    } else if(layout === 'detail' && type === 'person') {
      this.state.fetchPerson(identifier)
    }
  };

}
