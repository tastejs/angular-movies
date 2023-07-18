import {DestroyRef, inject, Injectable} from '@angular/core';
import {RxState} from '@rx-angular/state';
import {AppInitializer} from '../shared/cdk/app-initializer';
import {concatMap, filter, merge, tap} from 'rxjs';
import {ListResource} from '../data-access/api/resources/list.resource';
import {TMDBListCreateUpdateParams, TMDBListModel,} from '../data-access/api/model/list.model';
import {Router} from '@angular/router';
import {MovieResponse} from '../data-access/api/resources/movie.resource';
import {TMDBMovieDetailsModel} from '../data-access/api/model/movie-details.model';
import {deleteProp, patch} from '@rx-angular/cdk/transformations';
import {RxActionFactory} from '@rx-angular/state/actions';

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
  private readonly router = inject(Router);
  private readonly actionsF = new RxActionFactory<Actions>();
  private readonly listResource = inject(ListResource);
  private actions = this.actionsF.create();

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
        this.listResource.addMovieToList({
          id,
          items: [{ media_id: movie.id, media_type: 'movie' }],
        })
      )
    ),
    this.actions.deleteMovieFromList$.pipe(
      concatMap(([movie, id]) =>
        this.listResource.deleteMovieFromList({
          id,
          items: [{ media_id: movie.id || 0, media_type: 'movie' }],
        })
      )
    ),
    this.actions.updateList$.pipe(
      concatMap((params) => this.listResource.updateList(params))
    ),
    this.actions.createList$.pipe(
      concatMap((params) => this.listResource.createList(params)),
      tap((id) => id && this.router.navigate(['account/my-lists']))
    ),
    this.actions.deleteList$.pipe(
      tap((id) => id && this.router.navigate(['account/my-lists'])),
      concatMap((id) => this.listResource.deleteList(id))
    )
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.actionsF.destroy());
    super();

    this.connect(
      'lists',
      this.actions.fetchList$.pipe(
        filter((id) => !isNaN(Number(id))),
        concatMap((id) => this.listResource.fetchList(id))
      ),
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

  initialize(): void {
    return;
  }
}
