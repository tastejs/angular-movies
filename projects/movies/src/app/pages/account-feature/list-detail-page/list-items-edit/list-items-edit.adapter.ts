import { inject, Injectable } from '@angular/core';
import {
  dictionaryToArray,
  toDictionary,
} from '@rx-angular/cdk/transformations';
import { rxState } from '@rx-angular/state';
import { selectSlice } from '@rx-angular/state/selections';
import { W92H138 } from '../../../..//data-access/images/image-sizes';
import { ImageTag } from '../../../..//shared/cdk/image/image-tag.interface';
import { addImageTag } from '../../../..//shared/cdk/image/image-tag.transform';
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
import { rxActions } from '@rx-angular/state/actions';
import { rxEffects } from '@rx-angular/state/effects';
import { ListState } from '../../../../state/list.state';

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
export class ListItemsEditAdapter {
  readonly ui = rxActions<Actions>();
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
  private detailsAdapter = inject(ListDetailAdapter);

  private state = rxState<{
    id: number;
    items: Record<number, Partial<TMDBMovieDetailsModel>>;
    searchResults: MovieSearchResult[];
    showResults: boolean;
    searchValue: string;
    latestSelectedTitle: string;
  }>(({ connect, set }) => {
    set({
      showResults: false,
      searchResults: [],
      searchValue: '',
    });

    connect(this.searchResponse$, (_, searchResults) => ({
      searchResults,
      showResults: true,
    }));

    connect(this.detailsAdapter.listDetails$, (_, list) => ({
      id: list.id,
      items: toDictionary(list.results || [], 'id'),
    }));

    connect(this.ui.toggleResults$, (state, showResults) => ({
      showResults,
      searchValue: showResults ? '' : state.latestSelectedTitle,
      searchResults: [],
    }));

    connect(this.ui.addMovie$, (_, movie) => ({
      showResults: false,
      searchValue: movie.title,
      latestSelectedTitle: movie.title,
    }));
  });
  private listState = inject(ListState);
  private moviesResource = inject(MovieResource);

  readonly srcset = '92w, 154w, 185w, 342w, 500w, 780w';

  readonly vm$ = this.state.select(
    selectSlice(['items', 'searchResults', 'showResults', 'searchValue']),
    map(({ items, searchResults, showResults, searchValue }) => ({
      items: dictionaryToArray(items),
      searchResults: searchResults.filter((r) => !items[r.id]),
      showResults,
      searchValue,
    }))
  );

  readonly addMovieEvent$ = this.ui.addMovie$.pipe(
    withLatestFrom(this.state.select('id'))
  );

  readonly deleteMovieEvent$ = this.ui.deleteMovie$.pipe(
    withLatestFrom(this.state.select('id'))
  );
  constructor() {
    rxEffects(({ register }) => {
      register(this.addMovieEvent$, this.listState.addMovieToList);
      register(this.deleteMovieEvent$, this.listState.deleteMovieFromList);
    });
  }
}
