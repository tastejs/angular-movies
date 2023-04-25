import { RxState } from '@rx-angular/state';
import { Injectable } from '@angular/core';
import { exhaustMap } from 'rxjs';
import { RxActionFactory } from '@rx-angular/state/actions';
import {
  GenreResource,
  GenresResponse,
} from '../../data-access/api/resources/genre.resource';
import { AppInitializer } from '../rxa-custom/app-initializer';

export interface State {
  genres: GenresResponse;
}

interface Actions {
  refreshGenres: void;
}

@Injectable({
  providedIn: 'root',
})
export class GenreState extends RxState<State> implements AppInitializer {
  private actions = this.actionsF.create();

  readonly genresNames$ = this.select('genres');

  readonly refreshGenres = this.actions.refreshGenres;

  constructor(
    private actionsF: RxActionFactory<Actions>,
    private genreResource: GenreResource
  ) {
    super();

    this.connect(
      'genres',
      this.actions.refreshGenres$.pipe(
        /**
         * **🚀 Perf Tip for TTI, TBT:**
         *
         * Avoid over fetching for HTTP get requests to URLs that will not change result quickly.
         * E.G.: URLs with the same params
         */
        exhaustMap(this.genreResource.getGenres)
      )
    );
  }

  initialize(): void {
    // initially fetch genres
    this.refreshGenres();
  }
}
