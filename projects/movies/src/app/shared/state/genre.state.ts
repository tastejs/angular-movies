import { Injectable } from '@angular/core';
import { exhaustMap } from 'rxjs';
import { TMDBMovieGenreModel } from '../../data-access/model/movie-genre.model';
import { RxState } from '@rx-angular/state';
import { getActions } from '../rxa-custom/actions';
import { getGenres } from '../../data-access/api/genre.resource';

export interface State {
  genres: TMDBMovieGenreModel[];
}

interface Actions {
  refreshGenres: void;
}

@Injectable({
  providedIn: 'root'
})
export class GenreState extends RxState<State> {
  private actions = getActions<Actions>();

  readonly genresNames$ = this.select('genres');

  readonly refreshGenres = this.actions.refreshGenres;

  constructor() {
    super();

    this.connect('genres', this.actions.refreshGenres$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => getGenres()))
    );

  }

  initialFetch = () => {
    // initially fetch genres
    this.refreshGenres();
  };

}
