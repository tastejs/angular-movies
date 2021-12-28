import { Injectable } from '@angular/core';
import { exhaustMap } from 'rxjs';
import { MovieGenreModel } from '../../data-access/model/movie-genre.model';
import { RxState } from '@rx-angular/state';
import { getActions } from '../rxa-custom/actions';
import { GenreResource } from '../../data-access/api/genre.resource';

export interface State {
  genres: MovieGenreModel[];
}

interface Actions {
  refreshGenres: void;
  fetchGenreMovies: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenreState extends RxState<State> {
  private actions = getActions<Actions>({ fetchGenreMovies: (e: string | number) => e + '' });

  readonly genresNames$ = this.select('genres');

  readonly refreshGenres = this.actions.refreshGenres;
  readonly fetchGenreMovies = this.actions.fetchGenreMovies;

  constructor(private genreResource: GenreResource) {
    super();

    this.connect('genres', this.actions.refreshGenres$.pipe(
      /**
       * **🚀 Perf Tip for TTI, TBT:**
       *
       * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
       * E.G.: URLs with the same params
       */
      exhaustMap(() => this.genreResource.getGenres()))
    );

  }

  initialFetch = () => {
    // initially fetch genres
    this.refreshGenres();
  };

}
