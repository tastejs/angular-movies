import {
  provideRouter,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { ROUTES } from './app.routing';

export const ROUTER_PROVIDER = provideRouter(
  ROUTES,
  // withDebugTracing(),
  /**
   * **🚀 Perf Tip for TBT:**
   *
   * Disable initial sync navigation in router config and schedule it in router-outlet container component
   */
  withDisabledInitialNavigation(),
  withInMemoryScrolling({
    /**
     * **💡 UX Tip for InfiniteScroll:**
     *
     * Reset scroll position to top on route change, users could be
     * irritated starting a new list from the bottom of the page.
     *
     * also: otherwise infinite scroll isn't working properly
     */
    scrollPositionRestoration: 'top',
  })
);
