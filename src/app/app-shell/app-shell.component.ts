import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilSomeChanged, RxState } from '@rx-angular/state';
import { Subject, filter, map, startWith } from 'rxjs';
import { AuthStateService } from '../auth/auth.state';
import { TmdbAuthEffects } from '../auth/tmdbAuth.effects';
import { StateService } from '../shared/service/state.service';
import { MovieGenreModel } from '../movies/model';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  // **🚀 Perf Tip:**
  // Use ChangeDetectionStrategy.OnPush in all components to reduce change detection & template re-evaluation
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class AppShellComponent {
  genres$ = this.tmdbState.genres$;
  @ViewChild('snav') snav: any;

  readonly viewState$ = this.state.select(
    distinctUntilSomeChanged(['sideDrawerOpen', 'activeRoute', 'loggedIn'])
  );
  readonly sideDrawerOpenToggle$ = new Subject<boolean>();

  constructor(
    private state: RxState<{
      activeRoute: string;
      loggedIn: boolean;
      sideDrawerOpen: boolean;
    }>,
    public tmdbState: StateService,
    public authState: AuthStateService,
    public authEffects: TmdbAuthEffects,
    private router: Router,
    private snackbar: MatSnackBar
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

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['/movies/popular'])
      : this.router.navigate(['/movies/search', { term }]);
  }

  onSignOut() {
    this.authEffects.signOut();

    this.snackbar.open('Goodbye', '', { duration: 2000 });

    this.router.navigate(['/movies/popular']);
  }

  navTo(path: string, args: any) {
    this.closeSidenav();
    this.resetPagination();
    this.router.navigate([path, args]);
  }

  closeSidenav() {
    this.sideDrawerOpenToggle$.next(false);
  }

  resetPagination() {
    sessionStorage.setItem('hubmovies-current-page', '1');
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (
    _: number,
    genre: MovieGenreModel
  ) => genre.name
}
