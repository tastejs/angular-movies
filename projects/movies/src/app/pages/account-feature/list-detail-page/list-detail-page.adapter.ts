import {inject, Injectable} from '@angular/core';
import {RxState} from '@rx-angular/state';
import {select, selectSlice} from '@rx-angular/state/selections';
import {map, Observable, startWith, switchMap, withLatestFrom} from 'rxjs';
import {W154H205, W300H450, W500H282, W92H138,} from '../../../data-access/images/image-sizes';
import {TMDBListCreateUpdateParams} from '../../../data-access/api/model/list.model';
import {TMDBMovieModel} from '../../../data-access/api/model/movie.model';
import {RxActionFactory} from '@rx-angular/state/actions';
import {ListState} from '../../../state/list.state';

import {RouterState} from '../../../shared/router/router.state';
import {ImageTag} from '../../../shared/cdk/image/image-tag.interface';
import {addImageTag} from '../../../shared/cdk/image/image-tag.transform';
import {addVideoTag} from '../../../shared/cdk/video/video-tag.transform';
import {addLinkTag} from '../../../shared/cdk/link/a-tag.transform';
import {TMDBMovieCastModel} from '../../../data-access/api/model/movie-credits.model';
import {Movie} from '../../../state/movie.state';
import {TMDBMovieDetailsModel} from '../../../data-access/api/model/movie-details.model';
import {LinkTag} from '../../../shared/cdk/link/a-tag.interface';
import {VideoTag} from '../../../shared/cdk/video/video.interface';
import {MY_LIST_FALLBACK} from '../../../constants';

type Actions = {
  listInfoUpdate: TMDBListCreateUpdateParams;
  deleteList: void;
  listPosterUpdate: string;
};
export type ListPoster = TMDBMovieModel & ImageTag & { selected: boolean };

export type MovieDetail = TMDBMovieDetailsModel &
  LinkTag &
  ImageTag &
  VideoTag & { languages_runtime_release: string };

export type MovieCast = TMDBMovieCastModel & ImageTag;

@Injectable({
  providedIn: 'root',
})
export class ListDetailAdapter extends RxState<{
  id: string;
}> {
  private readonly listState = inject(ListState);
  private readonly routerState = inject(RouterState);
  readonly ui = new RxActionFactory<Actions>().create();

  readonly srcset = '154w, 185w, 342w, 500w, 780w';

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

  readonly movies$ = this.listDetails$.pipe(
    select('results'),
    map((r) => (r !== undefined ? r.map(transformToMovieModel) : []))
  );

  readonly posters$: Observable<ListPoster[] | undefined> =
    this.listDetails$.pipe(
      selectSlice(['results', 'backdrop_path']),
      map(({ results, backdrop_path }) =>
        results?.map((m) => ({
          ...addImageTag(m, {
            pathProp: 'backdrop_path',
            dims: W500H282,
            fallback: MY_LIST_FALLBACK,
          }),
          selected: m.backdrop_path === backdrop_path,
        }))
      )
    );

  readonly listName$ = this.listDetails$.pipe(
    select('name'),
    startWith('Loading...')
  );

  constructor() {
    super();

    this.connect('id', this.routerListId$);

    this.hold(this.routerListId$, this.listState.fetchList);
    this.hold(this.listInfoUpdateEvent$, ([info, id]) =>
      this.listState.updateList({ ...info, id: +id })
    );

    this.hold(this.listPosterUpdateEvent$, ([backdrop_path, id]) =>
      this.listState.updateList({ backdrop_path, id: +id })
    );

    this.hold(this.listDeleteEvent$, ([, id]) => this.listState.deleteList(id));
  }
}

export function transformToMovieDetail(_res: TMDBMovieModel): MovieDetail {
  const res = _res as unknown as MovieDetail;
  let language: string | boolean = false;
  if (
    Array.isArray(res?.spoken_languages) &&
    res?.spoken_languages.length !== 0
  ) {
    language = res.spoken_languages[0].english_name;
  }
  res.languages_runtime_release = `${language + ' / ' || ''} ${
    res.runtime
  } MIN. / ${new Date(res.release_date).getFullYear()}`;

  addVideoTag(res, {
    pathPropFn: (r) =>
      (r?.videos?.results && r?.videos?.results[0]?.key + '') || '',
  });
  addImageTag(res, {
    pathProp: 'poster_path',
    dims: W300H450,
    sizes: `(min-width: 900px) 400px, 65vw`,
    srcset: '154w, 185w, 342w, 500w, 780w',
  });
  addLinkTag(res, 'imdb_id', {});
  return res as MovieDetail;
}
export function transformToCastList(_res: TMDBMovieCastModel): MovieCast {
  const res = _res as unknown as MovieCast;
  addImageTag(res, {
    pathProp: 'profile_path',
    dims: W92H138,
    sizes: `44px`,
    srcset: '154w',
  });
  return res;
}
export function transformToMovieModel(_res: TMDBMovieModel): Movie {
  return addImageTag(_res as Movie, {
    pathProp: 'poster_path',
    dims: W154H205,
    sizes: '(min-width: 900px) 20vw, 70vw',
    srcset: '154w, 185w, 342w, 500w, 780w',
  });
}
