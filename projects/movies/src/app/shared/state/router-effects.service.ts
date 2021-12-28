import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { RouterParams, RouterStateService } from './router-state.service';
import { GenreState } from './genre.state';
import { PersonState } from './person.state';
import { SearchState } from './search.state';
import { MovieState } from './movie.state';

/**
 * This service manages data fetching based on router params
 */
@Injectable({
  providedIn: 'root'
})
export class RouterEffectsService extends RxState<any> {

  constructor(private routerState: RouterStateService,
              private genreState: GenreState,
              private personState: PersonState,
              private searchState: SearchState,
              private movieState: MovieState
  ) {
    super();
  }

  init = () => this.hold(this.routerState.routerParams$, this.routerFetchEffect);

  private routerFetchEffect = ({ layout, type, identifier }: RouterParams) => {
    if (type === 'category') {
      this.movieState.fetchCategoryMovies(identifier);
    } else if (type === 'genre') {
      this.genreState.fetchGenreMovies(identifier);
    } else if (type === 'search') {
      this.searchState.fetchSearchMovies(identifier);
    }

    if (layout === 'detail' && type === 'movie') {
      this.movieState.fetchMovie(identifier);
    } else if (layout === 'detail' && type === 'person') {
      this.personState.fetchPerson(identifier);
    }
  };

}
