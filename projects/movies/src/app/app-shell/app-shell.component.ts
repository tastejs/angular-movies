import { RxState } from '@rx-angular/state';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { TMDBMovieGenreModel } from '../data-access/api/model/movie-genre.model';
import { fallbackRouteToDefault } from '../shared/router/routing-default.util';
import { trackByProp } from '../shared/utils/track-by';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RouterState } from '../shared/router/router.state';
import { getIdentifierOfTypeAndLayoutUtil } from '../shared/router/get-identifier-of-type-and-layout.util';
import { GenreResource } from '../data-access/api/resources/genre.resource';
import { RxEffects } from '@rx-angular/state/effects';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { LetModule } from '@rx-angular/template/let';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { LazyDirective } from '../shared/cdk/lazy/lazy.directive';
import { FastIconModule } from '../shared/fast-icon/fast-icon.module';

type Actions = {
  sideDrawerOpenToggle: boolean;
  loadAccountMenu: void;
};

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LetModule,
    ForModule,
    FastIconModule,
    HamburgerButtonComponent,
    SideDrawerComponent,
    SearchBarComponent,
    DarkModeToggleComponent,
    LazyDirective,
  ],
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState, RxEffects, RxActionFactory],
})
export class AppShellComponent {
  readonly ui = this.actionsF.create();

  search$ = this.routerState.select(
    getIdentifierOfTypeAndLayoutUtil('search', 'list')
  );

  accountMenuComponent$ = this.ui.loadAccountMenu$.pipe(
    switchMap(() =>
      import('./account-menu/account-menu.component.lazy').then(({ c }) => c)
    ),
    shareReplay(1)
  );

  constructor(
    private readonly state: RxState<{
      sideDrawerOpen: boolean;
    }>,
    public effects: RxEffects,
    public routerState: RouterState,
    public genreResource: GenreResource,
    @Inject(DOCUMENT) document: Document,
    private router: Router,
    private actionsF: RxActionFactory<Actions>
  ) {
    this.init();
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component.
     * We use a scheduling API (setTimeout) to run it in a separate task from the bootstrap phase
     */
    setTimeout(() =>
      this.router.navigate([fallbackRouteToDefault(document.location.pathname)])
    );
  }

  init() {
    this.state.set({ sideDrawerOpen: false });
    this.state.connect('sideDrawerOpen', this.ui.sideDrawerOpenToggle$);

    this.effects.register(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      ),
      () => this.closeSidenav()
    );
  }

  readonly genres$ = this.genreResource.getGenresCached();

  readonly viewState$ = this.state.select();

  readonly trackByGenre: TrackByFunction<TMDBMovieGenreModel> =
    trackByProp<TMDBMovieGenreModel>('name');

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['list/category/popular'])
      : this.router.navigate([`list/search/${term}`]);
  }

  closeSidenav = () => {
    this.ui.sideDrawerOpenToggle(false);
  };
}
