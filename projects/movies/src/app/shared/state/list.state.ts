import { Injectable } from '@angular/core';
import { deleteProp, patch, RxState } from '@rx-angular/state';
import { AppInitializer } from '../rxa-custom/app-initializer';
import { getActions } from '../rxa-custom/actions';
import { concatMap, merge, tap } from 'rxjs';
import {
  addMovieToList,
  createList,
  fetchList,
  deleteMovieFromList,
  updateList,
  deleteList,
} from '../../data-access/api/resources/list.resource';
import {
  TMDBListCreateUpdateParams,
  TMDBListModel,
} from '../../data-access/api/model/list.model';
import { Router } from '@angular/router';
import { MovieResponse } from '../../data-access/api/resources/movie.resource';
import { TMDBMovieDetailsModel } from '../../data-access/api/model/movie-details.model';

export interface ListModel {
  lists: Record<string, TMDBListModel>;
}

interface Actions {
  createList: TMDBListCreateUpdateParams;
  updateList: TMDBListCreateUpdateParams;
  addMovieToList: [MovieResponse, number];
  deleteMovieFromList: [Partial<TMDBMovieDetailsModel>, number];
  deleteList: string;
  fetchList: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListState extends RxState<ListModel> implements AppInitializer {
  private actions = getActions<Actions>();

  readonly createList = this.actions.createList;
  readonly fetchList = this.actions.fetchList;
  readonly updateList = this.actions.updateList;
  readonly addMovieToList = this.actions.addMovieToList;
  readonly deleteMovieFromList = this.actions.deleteMovieFromList;
  readonly deleteList = this.actions.deleteList;
  readonly deleteListSignal$ = this.actions.deleteList$;

  private readonly sideEffects$ = merge(
    this.actions.addMovieToList$.pipe(
      concatMap(([movie, id]) =>
        addMovieToList({
          id,
          items: [{ media_id: movie.id, media_type: 'movie' }],
        })
      )
    ),
    this.actions.deleteMovieFromList$.pipe(
      concatMap(([movie, id]) =>
        deleteMovieFromList({
          id,
          items: [{ media_id: movie.id || 0, media_type: 'movie' }],
        })
      )
    ),
    this.actions.updateList$.pipe(concatMap((params) => updateList(params))),
    this.actions.createList$.pipe(
      concatMap((params) => createList(params)),
      tap((id) => id && this.router.navigate(['my-lists']))
    ),
    this.actions.deleteList$.pipe(
      tap((id) => id && this.router.navigate(['my-lists'])),
      concatMap((id) => deleteList(id))
    )
  );

  constructor(private router: Router) {
    super();

    this.connect(
      'lists',
      this.actions.fetchList$.pipe(concatMap((id) => fetchList(id))),
      (state, list) => patch(state?.lists || {}, list)
    );

    this.connect('lists', this.actions.updateList$, (state, update) => {
      if (state && update.id) {
        return patch(state.lists, {
          [update.id]: patch(state.lists[update.id], update),
        });
      }

      return state.lists;
    });

    this.connect(
      'lists',
      this.actions.addMovieToList$,
      (state, [movie, id]) => {
        if (state && id) {
          return patch(state.lists, {
            [id]: patch(state.lists[id], {
              results: [...(state.lists[id].results || []), movie],
            }),
          });
        }

        return state.lists;
      }
    );

    this.connect('lists', this.actions.deleteList$, (state, id) => {
      if (state && id) {
        return deleteProp(state.lists, `${id}`);
      }

      return state.lists;
    });

    this.connect(
      'lists',
      this.actions.deleteMovieFromList$,
      (state, [movie, id]) => {
        if (state && id) {
          return patch(state.lists, {
            [id]: patch(state.lists[id], {
              results: (state.lists[id].results || []).filter(
                (m) => m.id !== movie.id
              ),
            }),
          });
        }

        return state.lists;
      }
    );

    this.hold(this.sideEffects$);
  }

  initialize(): void {}
}
