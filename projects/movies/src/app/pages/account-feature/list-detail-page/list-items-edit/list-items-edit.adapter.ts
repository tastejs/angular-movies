import { Injectable } from '@angular/core';
import {
  dictionaryToArray,
  toDictionary,
} from '@rx-angular/cdk/transformations';
import { RxState, selectSlice } from '@rx-angular/state';
import { W92H138 } from 'projects/movies/src/app/data-access/api/constants/image-sizes';
import { ImageTag } from 'projects/movies/src/app/shared/utils/image/image-tag.interface';
import { addImageTag } from 'projects/movies/src/app/shared/utils/image/image-tag.transform';
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
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

export type MovieSearchResult = TMDBMovieModel & ImageTag & { inList: boolean };

@Injectable({
  providedIn: 'root',
})
export class ListItemsEditAdapter extends RxState<{
  id: number;
  items: Record<number, Partial<TMDBMovieDetailsModel>>;
  searchResults: MovieSearchResult[];
}> {
  readonly ui = getActions<Actions>();

  readonly items$ = this.select(
    selectSlice(['items']),
    map(({ items }) => dictionaryToArray(items))
  );
  readonly searchResults$ = this.select(
    selectSlice(['items', 'searchResults']),
    map(({ items, searchResults }) =>
      searchResults.map((r) => ({ ...r, inList: !!items[r.id] }))
    )
  );

  readonly addMovieEvent$ = this.ui.addMovie$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly deleteMovieEvent$ = this.ui.deleteMovie$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly searchResponse$ = this.ui.search$.pipe(
    distinctUntilChanged(),
    filter(Boolean),
    exhaustMap((request) => queryMovie(request)),
    map((movies) =>
      movies.map((m) =>
        addImageTag(
          { ...m, inList: false },
          { pathProp: 'poster_path', dims: W92H138 }
        )
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
      items: toDictionary(list.results || [], 'id'),
    }));

    this.hold(this.addMovieEvent$, this.state.addMovieToList);
    this.hold(this.deleteMovieEvent$, this.state.deleteMovieFromList);
  }
}
