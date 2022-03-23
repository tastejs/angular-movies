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
  MovieResource,
  MovieResponse,
} from '../../../../data-access/api/resources/movie.resource';
import { ListDetailAdapter } from '../../../../pages/account-feature/list-detail-page/list-detail-page.adapter';
import { RxActionFactory } from '../../../../shared/rxa-custom/actions';
import { ListState } from '../../../../shared/state/list.state';

interface Actions {
  search: string;
  addMovie: MovieResponse;
  deleteMovie: Partial<TMDBMovieDetailsModel>;
  toggleResults: boolean;
}

export type MovieSearchResult = TMDBMovieModel & ImageTag;

@Injectable({
  providedIn: 'root',
})
export class ListItemsEditAdapter extends RxState<{
  id: number;
  items: Record<number, Partial<TMDBMovieDetailsModel>>;
  searchResults: MovieSearchResult[];
  showResults: boolean;
  searchValue: string;
  latestSelectedTitle: string;
}> {
  readonly ui = new RxActionFactory<Actions>().create();

  readonly vm$ = this.select(
    selectSlice(['items', 'searchResults', 'showResults', 'searchValue']),
    map(({ items, searchResults, showResults, searchValue }) => ({
      items: dictionaryToArray(items),
      searchResults: searchResults.filter((r) => !items[r.id]),
      showResults,
      searchValue,
    }))
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
    exhaustMap((request) => this.moviesResource.queryMovie(request)),
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
    private detailsAdapter: ListDetailAdapter,
    private moviesResource: MovieResource
  ) {
    super();

    this.set({
      showResults: false,
      searchResults: [],
      searchValue: '',
    });

    this.connect(this.searchResponse$, (_, searchResults) => ({
      searchResults,
      showResults: true,
    }));

    this.connect(this.detailsAdapter.listDetails$, (_, list) => ({
      id: list.id,
      items: toDictionary(list.results || [], 'id'),
    }));

    this.connect(this.ui.toggleResults$, (state, showResults) => ({
      showResults,
      searchValue: showResults ? '' : state.latestSelectedTitle,
      searchResults: [],
    }));
    this.connect(this.ui.addMovie$, (_, movie) => ({
      showResults: false,
      searchValue: movie.title,
      latestSelectedTitle: movie.title,
    }));

    this.hold(this.addMovieEvent$, this.state.addMovieToList);
    this.hold(this.deleteMovieEvent$, this.state.deleteMovieFromList);
  }
}
