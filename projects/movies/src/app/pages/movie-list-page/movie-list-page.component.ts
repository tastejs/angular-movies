import { selectSlice } from '@rx-angular/state/selections';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { MovieListPageAdapter } from './movie-list-page.adapter';
import { MovieListPageModel } from './movie-list-page-adapter.model';

type Heading = { main: string; sub: string };

@Component({
  selector: 'ct-movies-list',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListPageComponent {
  readonly movies$ = this.adapter.select('results');
  readonly loading$ = this.adapter.select('loading');
  readonly headings$: Observable<Heading> = this.adapter.select(
    selectSlice(['identifier', 'type', 'genres']),
    map(toHeading)
  );

  constructor(private adapter: MovieListPageAdapter) {
    this.adapter.set({ loading: true });
  }

  paginate() {
    this.adapter.paginate();
  }
}

function toHeading(
  routerParams: Pick<MovieListPageModel, 'type' | 'identifier' | 'genres'>
): Heading {
  const { identifier, type, genres } = routerParams;
  // default
  let sub: string = type;
  const main: string = identifier?.replace(/[-_]/, ' ');

  // genre identifier needs to get mapped to a real title
  if (type === 'genre') {
    sub = genres[parseInt(identifier)].name;
  }

  return { main, sub };
}
