import { APP_INITIALIZER } from '@angular/core';
import { GenreResource } from './data-access/api/resources/genre.resource';
import { MovieState } from './shared/state/movie.state';
import { RouterState } from './shared/router/router.state';
import { take } from 'rxjs';

function initializeState(
  movieState: MovieState,
  routerState: RouterState,
  genreResource: GenreResource
) {
  return (): void => {
    // sideBar prefetch
    genreResource.getGenresCached().pipe(take(1)).subscribe();
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
    deps: [MovieState, RouterState, GenreResource],
    multi: true,
  },
];
