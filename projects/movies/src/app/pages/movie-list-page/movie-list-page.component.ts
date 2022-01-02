import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { map, Observable } from 'rxjs';
import { MovieListPageAdapter } from './movie-list-page.adapter';
import { parseTitle } from '../../shared/utils/parse-movie-list-title';

@Component({
  selector: 'ct-movies-list',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent {
  readonly movies$ = this.adapter.select('results');
  readonly loading$ = this.adapter.select(
    selectSlice(['loading', 'results'], {
      results: (a, b) => a?.length !== b?.length
    }),
    map(({ loading, results }) => loading || results === null)
  );
  readonly headings$: Observable<{ title: string, type: string }> = this.adapter.select(
    selectSlice(['identifier', 'type']),
    map(({ identifier, type }) => ({ type, title: parseTitle(identifier) }))
  );

  constructor(private adapter: MovieListPageAdapter) {
    this.adapter.set({ loading: true });
  }

  paginate() {
    this.adapter.paginate();
  }
}
