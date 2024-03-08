import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { TMDBMovieGenreModel } from '../data-access/api/model/movie-genre.model';
import { trackByProp } from '../shared/cdk/track-by';
import { fallbackRouteToDefault, RouterState } from '../shared/router/router.state';
import { getIdentifierOfTypeAndLayoutUtil } from '../shared/router/get-identifier-of-type-and-layout.util';
import { GenreResource } from '../data-access/api/resources/genre.resource';
import { rxEffects } from '@rx-angular/state/effects';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { RxLet } from '@rx-angular/template/let';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { RxFor } from '@rx-angular/template/for';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import AccountMenuComponent from './account-menu/account-menu.component';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    RxLet,
    RxFor,
    FastSvgComponent,
    HamburgerButtonComponent,
    SideDrawerComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    RouterLinkActive,
    AccountMenuComponent
  ],
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class AppShellComponent {
  sideDrawerOpen = signal(false);

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly routerState = inject(RouterState);
  readonly effects = rxEffects((e) =>
    e.register(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      ),
      () => this.sideDrawerOpen.set(false)
    )
  );

  genreResource = inject(GenreResource);

  search$ = this.routerState.select(
    getIdentifierOfTypeAndLayoutUtil('search', 'list')
  );

  constructor() {
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component.
     * We use a scheduling API (setTimeout) to run it in a separate task from the bootstrap phase
     */
    setTimeout(() => {
      this.router.navigate([
        // The pathname route seems to work correctly on SSR but when pre-rendering it is an empty string.
        // We have to fall back to document URL as a fix.
        fallbackRouteToDefault(
          this.document.location.pathname || this.document.URL
        ),
      ]);
    });
  }

  readonly genres$ = this.genreResource.getGenresCached();

  readonly trackByGenre: TrackByFunction<TMDBMovieGenreModel> =
    trackByProp<TMDBMovieGenreModel>('name');

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['list/category/popular'])
      : this.router.navigate([`list/search/${term}`]);
  }
}
