import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { map } from 'rxjs';
import { MovieListPageAdapter } from './movie-list-page.adapter';

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent {

  readonly movies$ = this.adapter.select('movies');
  readonly loading$ = this.adapter.select(
    selectSlice(['loading', 'movies'], {
      movies: (a, b) => a?.length !== b?.length
    }),
    map(({ loading, movies }) => loading || movies === null)
  );
  readonly headings$ = this.adapter.select(selectSlice(['title', 'type']));

  constructor(
    private adapter: MovieListPageAdapter
  ) {
    this.adapter.set({ loading: true });
  }

}
