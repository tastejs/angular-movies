import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { TMDBMovieGenreModel } from '../data-access/api/model/movie-genre.model';
import { trackByProp } from '../shared/utils/track-by';
import { getActions } from '../shared/rxa-custom/actions';
import { RouterState } from '../shared/state/router.state';
import { getIdentifierOfTypeAndLayout } from '../shared/state/utils';
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
  readonly ui = getActions<{
    sideDrawerOpenToggle: boolean;
    loadAccountMenu: void;
  }>();

  search$ = this.routerState.select(
    getIdentifierOfTypeAndLayout('search', 'list')
  );

  /*
    accountMenuComponent$ = this.ui.loadAccountMenu$.pipe(
      switchMap(() =>
        import('./account-menu/account-menu.component.lazy').then(({ c }) => c)
      ),
      shareReplay(1)
    ); */

  constructor(
    private readonly state: RxState<{
      sideDrawerOpen: boolean;
    }>,
    public routerState: RouterState,
    @Inject(DOCUMENT) document: Document,
    private router: Router
  ) {
    this.init();
    /**
     * **🚀 Perf Tip for TBT:**
     *
     * Disable initial sync navigation in router config and schedule it in router-outlet container component.
     * We use a scheduling API (setTimeout) to run it in a separate task from the bootstrap phase
     */
    setTimeout(() => this.router.navigate([document.location.pathname]));
  }

  init() {
    this.state.set({ sideDrawerOpen: false });
    this.state.connect('sideDrawerOpen', this.ui.sideDrawerOpenToggle$);

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
