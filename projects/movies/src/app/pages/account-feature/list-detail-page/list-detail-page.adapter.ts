import { Injectable } from '@angular/core';
import { RxState, select, selectSlice } from '@rx-angular/state';
import { map, Observable, startWith, switchMap, withLatestFrom } from 'rxjs';
import { W500H282 } from '../../../data-access/api/constants/image-sizes';
import { TMDBListCreateUpdateParams } from '../../../data-access/api/model/list.model';
import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { getActions } from '../../../shared/rxa-custom/actions';
import { ListState } from '../../../shared/state/list.state';

import { RouterState } from '../../../shared/state/router.state';
import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../../shared/utils/image/image-tag.transform';

export type ListPoster = TMDBMovieModel & ImageTag & { selected: boolean };
@Injectable({
  providedIn: 'root',
})
export class ListDetailAdapter extends RxState<{
  id: string;
}> {
  readonly ui = getActions<{
    listInfoUpdate: TMDBListCreateUpdateParams;
    deleteList: void;
    listPosterUpdate: string;
  }>();

  readonly routerListId$ = this.routerState.select(map((state) => state?.type));

  private readonly listInfoUpdateEvent$ = this.ui.listInfoUpdate$.pipe(
    withLatestFrom(this.select('id'))
  );

  private readonly listPosterUpdateEvent$ = this.ui.listPosterUpdate$.pipe(
    withLatestFrom(this.select('id'))
  );

  private readonly listDeleteEvent$ = this.ui.deleteList$.pipe(
    withLatestFrom(this.select('id'))
  );

  readonly listDetails$ = this.select('id').pipe(
    switchMap((id) => this.listState.select('lists', id))
  );

  readonly movies$ = this.listDetails$.pipe(select('results'));

  readonly posters$: Observable<ListPoster[] | undefined> =
    this.listDetails$.pipe(
      selectSlice(['results', 'backdrop_path']),
      map(({ results, backdrop_path }) =>
        results?.map((m) => ({
          ...addImageTag(m, {
            pathProp: 'backdrop_path',
            dims: W500H282,
          }),
          selected: m.backdrop_path === backdrop_path,
        }))
      )
    );

  readonly listName$ = this.listDetails$.pipe(
    select('name'),
    startWith('Loading...')
  );

  constructor(private listState: ListState, private routerState: RouterState) {
    super();

    this.connect('id', this.routerListId$);

    this.hold(this.routerListId$, this.listState.fetchList);
    this.hold(this.listInfoUpdateEvent$, ([info, id]) =>
      this.listState.updateList({ ...info, id: +id })
    );

    this.hold(this.listPosterUpdateEvent$, ([backdrop_path, id]) =>
      this.listState.updateList({ backdrop_path, id: +id })
    );

    this.hold(this.listDeleteEvent$, ([_, id]) =>
      this.listState.deleteList(id)
    );
  }
}
