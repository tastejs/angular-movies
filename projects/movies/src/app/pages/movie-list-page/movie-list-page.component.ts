import { selectSlice } from '@rx-angular/state/selections';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { MovieListPageAdapter } from './movie-list-page.adapter';
import { MovieListPageModel } from './movie-list-page-adapter.model';

import { Link } from '../../shared/link/link.service';

type Heading = { main: string; sub: string };

@Component({
  selector: 'ct-movies-list',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListPageComponent {
  readonly movies$ = this.adapter.select('results').pipe(
    tap((movies) => this.preloadLCPImage(movies[0]?.poster_path || null))
  );
  readonly loading$ = this.adapter.select('loading');
  readonly headings$: Observable<Heading> = this.adapter.select(
    selectSlice(['identifier', 'type', 'genres']),
    map(toHeading)
  );

  constructor(private adapter: MovieListPageAdapter, private linkService: Link) {
    this.adapter.set({ loading: true });
  }

  paginate() {
    this.adapter.paginate();
  }

  private preloadLCPImage(path: string | null): void | null {
    if (!path) return null;
    const href = "https://image.tmdb.org/t/p/w300" + path;
    const preloadLink = {
      rel: "preload", as: "image", type:"image/jpeg", href: href
    }
    this.linkService.addTag(preloadLink);
  }
}

function toHeading(
  routerParams: Pick<MovieListPageModel, 'type' | 'identifier' | 'genres'>
): Heading {
  const { identifier, type, genres } = routerParams;
  // default
  let main: string = identifier;
  const sub: string = type;

  // genre identifier needs to get mapped to a real title
  if (type === 'genre') {
    main = genres[parseInt(identifier)].name;
  }

  main = main.replace(/[-_]/, ' ');

  return { main, sub };
}
