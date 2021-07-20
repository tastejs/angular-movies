import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth/auth.state';
import { TmdbAuthEffects } from '../auth/tmdbAuth.effects';
import { StateService } from '../shared/service/state.service';
import { MovieGenreModel } from '../movies/model';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  // **🚀 Perf Tip:**
  // Use ChangeDetectionStrategy.OnPush in all components to reduce change detection
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  genres$ = this.tmdbState.genres$;
  lang: string;
  // tslint:disable-next-line: variable-name
  private _mobileQueryListener: () => void;
  @ViewChild('snav', { static: true }) snav: any;

  constructor(
    public tmdbState: StateService,
    public authState: AuthStateService,
    public authEffects: TmdbAuthEffects,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 731px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  @HostListener('window:scroll', ['$event']) scrollHandler(event) {
    const height = window.scrollY;
    const el = document.getElementById('btn-returnToTop');
    height >= 500 ? (el.className = 'show') : (el.className = 'hide');
  }

  scrollTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  searchMovie(term: string) {
    term === ''
      ? this.router.navigate(['/movies/now-playing'])
      : this.router.navigate(['/movies/search', { term }]);
  }

  onSignOut() {
    this.authEffects.signOut();

    this.snackbar.open('Goodbye', '', { duration: 2000 });

    this.router.navigate(['/movies/now-playing']);
  }

  closeSidenav() {
    if (this.mobileQuery.matches !== false) {
      this.snav.close();
    }
  }

  resetPagination() {
    sessionStorage.setItem('hubmovies-current-page', '1');
  }

  trackByGenre: TrackByFunction<MovieGenreModel> = (
    idx: number,
    genre: MovieGenreModel
  ) => genre.name
}
