import { ChangeDetectionStrategy, Component, TrackByFunction, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { filter, map } from 'rxjs';
import { AuthStateService } from '../data-access/auth/auth.state';
import { TmdbAuthEffects } from '../data-access/auth/tmdbAuth.effects';
import { MovieGenreModel } from '../data-access/model/movie-genre.model';
import { trackByProp } from '../shared/utils/track-by';
import { StateService } from '../shared/state/state.service';
import { getActions } from '../shared/rxa-custom/actions';
import { RouterStateService } from '../shared/state/router-state.service';
import { getIdentifierOfTypeAndLayout } from '../shared/state/utils';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class AppShellComponent {

  search$ = this.routerState.select(getIdentifierOfTypeAndLayout('search', 'list'));

  constructor(
    private readonly state: RxState<{
      activeRoute: string;
      loggedIn: boolean;
      sideDrawerOpen: boolean;
    }>,
    public routerState: RouterStateService,
    public globalState: StateService,
    public authState: AuthStateService,
    public authEffects: TmdbAuthEffects,
    private router: Router
  ) {

    this.init();
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component
     */
    setTimeout(() => this.router.navigate(['list/category/popular']));
  }

  init() {
    this.state.set({ sideDrawerOpen: false });
    this.state.connect(
      'sideDrawerOpen',
      this.ui.sideDrawerOpenToggle$
    );
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
  }

  readonly genres$ = this.globalState.genresNames$;
  @ViewChild('snav') snav: any;

  readonly viewState$ = this.state.select();
  readonly ui = getActions<{ sideDrawerOpenToggle: boolean }>();

  readonly trackByGenre: TrackByFunction<MovieGenreModel> =
    trackByProp<MovieGenreModel>('name');

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['list/category/popular'])
      : this.router.navigate([`list/search/${term}`]);
  }

  onSignOut() {
    this.authEffects.signOut();
    this.router.navigate(['/movies/popular']);
  }

  navTo(event: Event, path: string, args: (string | number)[], queryParams?: Record<string, any>) {
    event.preventDefault();
    event.stopPropagation();
    this.closeSidenav();
    this.router.navigate([path, ...args], { queryParams });
  }

  closeSidenav() {
    this.ui.sideDrawerOpenToggle(false);
  }

}
