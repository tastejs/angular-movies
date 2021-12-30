import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { map } from 'rxjs';
import { MovieListPageAdapter } from './movie-list-page.adapter';
import { getIdentifierOfTypeAndLayout } from '../../shared/state/utils';
@Component({
  selector: 'ct-movies-list',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListPageComponent {
  t = getIdentifierOfTypeAndLayout;
  readonly movies$ = this.adapter.select('movies');
  readonly loading$ = this.adapter.select(
    selectSlice(['loading', 'movies'], {
      movies: (a, b) => a?.length !== b?.length,
    }),
    map(({ loading, movies }) => loading || movies === null)
  );
  readonly paging$ = this.adapter.select('paging');
  readonly headings$ = this.adapter.select(selectSlice(['title', 'type']));

  constructor(private adapter: MovieListPageAdapter) {
    this.adapter.set({ loading: true });
  }

  paginate() {
    this.adapter.paginate();
  }
}
