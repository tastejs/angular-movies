import { ChangeDetectionStrategy, Component, TrackByFunction, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilSomeChanged, RxState } from '@rx-angular/state';
import { filter, map, startWith, Subject } from 'rxjs';
import { AuthStateService } from '../data-access/auth/auth.state';
import { TmdbAuthEffects } from '../data-access/auth/tmdbAuth.effects';
import { MovieGenreModel } from '../data-access/model';
import { trackByProp } from '../shared/utils/track-by';
import { StateService } from '../shared/state/state.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  // **🚀 Perf Tip:**
  // Use ChangeDetectionStrategy.OnPush in all components to reduce change detection & template re-evaluation
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState]
})
export class AppShellComponent {
  constructor(
    private state: RxState<{
      activeRoute: string;
      loggedIn: boolean;
      sideDrawerOpen: boolean;
    }>,
    public tmdbState: StateService,
    public authState: AuthStateService,
    public authEffects: TmdbAuthEffects,
    private router: Router
  ) {
    this.state.connect(
      'sideDrawerOpen',
      this.sideDrawerOpenToggle$.pipe(startWith(false))
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

  genres$ = this.tmdbState.genresNames$;
  @ViewChild('snav') snav: any;

  readonly viewState$ = this.state.select(
    distinctUntilSomeChanged(['sideDrawerOpen', 'activeRoute', 'loggedIn'])
  );
  readonly sideDrawerOpenToggle$ = new Subject<boolean>();

  trackByGenre: TrackByFunction<MovieGenreModel> =
    trackByProp<MovieGenreModel>('name');

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['/movies/popular'])
      : this.router.navigate(['/movies/search', { term }]);
  }

  onSignOut() {
    this.authEffects.signOut();
    this.router.navigate(['/movies/popular']);
  }

  navTo(path: string, args: (string | number)[], queryParams?: Record<string, any>) {
    this.closeSidenav();
    this.resetPagination();
    this.router.navigate([path, ...args], {queryParams});
  }

  closeSidenav() {
    this.sideDrawerOpenToggle$.next(false);
  }

  resetPagination() {
    sessionStorage.setItem('hubmovies-current-page', '1');
  }
}
