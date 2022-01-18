import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { AuthStateService } from '../data-access/auth/auth.state';
import { AuthEffects } from '../data-access/auth/auth.effects';
import { TMDBMovieGenreModel } from '../data-access/api/model/movie-genre.model';
import { trackByProp } from '../shared/utils/track-by';
import { getActions } from '../shared/rxa-custom/actions';
import { RouterState } from '../shared/state/router.state';
import { getIdentifierOfTypeAndLayout } from '../shared/state/utils';
import { preventDefault } from '../shared/rxa-custom/actions/transforms';
import { getGenresCached } from '../data-access/api/resources/genre.resource';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState],
})
export class AppShellComponent {
  search$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('search', 'list')
  );

  constructor(
    private readonly state: RxState<{
      activeRoute: string;
      loggedIn: boolean;
      sideDrawerOpen: boolean;
    }>,
    public routerState: RouterState,
    public authState: AuthStateService,
    public authEffects: AuthEffects,
    private router: Router
  ) {
    this.init();
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component
     */
    // @TODO !!!BUG!!! use current URL
    setTimeout(() => this.router.navigate(['list/category/popular']));
  }

  init() {
    this.state.set({ sideDrawerOpen: false });
    this.state.connect('sideDrawerOpen', this.ui.sideDrawerOpenToggle$);
    this.state.connect(
      'loggedIn',
      this.authState.accountId$.pipe(map((id) => !!id))
    );
    this.state.connect(
      'activeRoute',
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => e.urlAfterRedirects.split('?')[0])
      )
    );

    this.state.hold(this.ui.signOut$, this.onSignOut);
    this.state.hold(
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      ),
      () => this.closeSidenav()
    );
  }

  readonly genres$ = getGenresCached();
  @ViewChild('snav') snav: any;

  readonly viewState$ = this.state.select();
  readonly ui = getActions<{
    sideDrawerOpenToggle: boolean;
    signOut: Event;
  }>({
    signOut: preventDefault,
  });

  readonly trackByGenre: TrackByFunction<TMDBMovieGenreModel> =
    trackByProp<TMDBMovieGenreModel>('name');

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['list/category/popular'])
      : this.router.navigate([`list/search/${term}`]);
  }

  onSignOut = () => {
    this.authEffects.signOut();
    this.router.navigate(['/movies/popular']);
  };

  closeSidenav = () => {
    this.ui.sideDrawerOpenToggle(false);
  };
}
