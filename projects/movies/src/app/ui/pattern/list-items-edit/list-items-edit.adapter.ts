import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TMDBMovieDetailsModel } from '../../../data-access/api/model/movie-details.model';
import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import {
  MovieResponse,
  queryMovie,
} from '../../../data-access/api/resources/movie.resource';
import { ListDetailAdapter } from '../../../pages/account-feature/list-detail-page/list-detail-page.adapter';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListState } from '../../../shared/state/list.state';

interface Actions {
  search: string;
  addMovie: MovieResponse;
  deleteMovie: TMDBMovieDetailsModel;
}

@Injectable({
  providedIn: 'root',
})
export class ListItemsEditAdapter extends RxState<{
  id: number;
  items: Partial<TMDBMovieDetailsModel>[];
  searchResults: TMDBMovieModel[];
}> {
  readonly ui = getActions<Actions>();

  readonly items$ = this.select('items');
  readonly searchResults$ = this.select('searchResults');

  readonly addMovieEvent$ = this.ui.addMovie$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly deleteMovieEvent$ = this.ui.deleteMovie$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly searchResponse$ = this.ui.search$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    filter(Boolean),
    switchMap((request) => queryMovie(request))
  );

  constructor(
    private state: ListState,
    private detailsAdapter: ListDetailAdapter
  ) {
    super();

    this.connect('searchResults', this.searchResponse$);

    this.connect(this.detailsAdapter.listDetails$, (_, list) => ({
      id: list.id,
      items: list.results,
    }));

    this.hold(this.addMovieEvent$, this.state.addMovieToList);
    this.hold(this.deleteMovieEvent$, this.state.deleteMovieFromList);
  }
}
