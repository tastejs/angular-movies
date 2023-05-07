import { selectSlice } from '@rx-angular/state/selections';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  MovieListPageAdapter,
  MovieListPageModel,
} from './movie-list-page.adapter';
import { NgOptimizedImage } from '@angular/common';
import { LetDirective } from '@rx-angular/template/let';
import { RxIf } from '@rx-angular/template/if';
import { MovieListComponent } from '../../ui/pattern/movie-list/movie-list.component';

type Heading = { main: string; sub: string };

@Component({
  standalone: true,
  imports: [NgOptimizedImage, LetDirective, RxIf, MovieListComponent],
  selector: 'ct-movies-list',
  templateUrl: './movie-list-page.component.html',
  styleUrls: ['./movie-list-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MovieListPageComponent {
  private readonly adapter = inject(MovieListPageAdapter);

  readonly movies$ = this.adapter.movies$;
  readonly loading$ = this.adapter.select('loading');
  readonly headings$: Observable<Heading> = this.adapter.select(
    selectSlice(['identifier', 'type', 'genres']),
    map(toHeading)
  );

  constructor() {
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
  let main: string = identifier;
  const sub: string = type;

  // genre identifier needs to get mapped to a real title
  if (type === 'genre') {
    main = genres[parseInt(identifier)].name;
  }

  main = main.replace(/[-_]/, ' ');

  return { main, sub };
}
