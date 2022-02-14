import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { W92H138 } from 'projects/movies/src/app/data-access/api/constants/image-sizes';
import { ImageTag } from 'projects/movies/src/app/shared/utils/image/image-tag.interface';
import { addImageTag } from 'projects/movies/src/app/shared/utils/image/image-tag.transform';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TMDBMovieDetailsModel } from '../../../../data-access/api/model/movie-details.model';
import { TMDBMovieModel } from '../../../../data-access/api/model/movie.model';
import {
  MovieResponse,
  queryMovie,
} from '../../../../data-access/api/resources/movie.resource';
import { ListDetailAdapter } from '../../../../pages/account-feature/list-detail-page/list-detail-page.adapter';
import { getActions } from '../../../../shared/rxa-custom/actions';
import { ListState } from '../../../../shared/state/list.state';

interface Actions {
  search: string;
  addMovie: MovieResponse;
  deleteMovie: Partial<TMDBMovieDetailsModel>;
}

@Injectable({
  providedIn: 'root',
})
export class ListItemsEditAdapter extends RxState<{
  id: number;
  items: Partial<TMDBMovieDetailsModel>[];
  searchResults: (TMDBMovieModel & ImageTag)[];
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
    switchMap((request) => queryMovie(request)),
    map((movies) =>
      movies.map((m) =>
        addImageTag(m, { pathProp: 'poster_path', dims: W92H138 })
      )
    )
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
