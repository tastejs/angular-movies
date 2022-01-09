import { APP_INITIALIZER } from '@angular/core';
import { getGenresCached } from '../../data-access/api/resources/genre.resource';
import { MovieState } from './movie.state';
import { RouterState } from './router.state';
import { take } from 'rxjs';

function initializeState(movieState: MovieState, routerState: RouterState) {
  return (): void => {
    // sideBar prefetch
    getGenresCached().pipe(take(1)).subscribe();
    // initial route prefetch
    routerState.routerParams$
      .pipe(take(1))
      .subscribe(({ layout, type, identifier }) => {
        // default route
        layout === 'list' &&
          type === 'category' &&
          movieState.initialize({ category: identifier });
        // movie detail route
        layout === 'detail' &&
          type === 'movie' &&
          movieState.initialize({ movieId: identifier });
      });
  };
}

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export const GLOBAL_STATE_APP_INITIALIZER_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeState,
    deps: [MovieState, RouterState],
    multi: true,
  },
];
