import {APP_INITIALIZER} from '@angular/core';
import {GenreResource} from '../data-access/api/resources/genre.resource';
import {MovieState} from './movie.state';
import {RouterState} from '../shared/router/router.state';
import {take} from 'rxjs';

/**
 * **🚀 Perf Tip for LCP, TTI:**
 *
 * Use `APP_INITIALIZER` and an init method in data services to run data fetching
 * on app bootstrap instead of component initialization.
 */
export function withGobalStateInitializer() {
  return [
    {
      provide: APP_INITIALIZER,
      useFactory: (
        movieState: MovieState,
        routerState: RouterState,
        genreResource: GenreResource
      ) => {
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
      },
      deps: [MovieState, RouterState, GenreResource],
      multi: true,
    },
  ];
}
