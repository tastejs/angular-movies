import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { map, Observable } from 'rxjs';
import { MovieModel } from '../../../data-access/model';
// @Todo: move const into data-access folder as related to API
import { W300H450 } from '../../../shared/utils/image-sizes';

interface Movie extends MovieModel {
  url: string;
}

@Component({
  selector: 'app-movie-list',
  template: `
    <ng-content select=".header"></ng-content>
    <ng-container
      *rxLet="hasMovies$; let hasMovies; strategy: 'instantUserBlocking'"
    >
      <div class="movies-list--grid" *ngIf="hasMovies; else noData">
        <a
          class="movies-list--grid-item"
          *rxFor="let movie of movies$; trackBy: movieById"
          (click)="toMovie(movie)"
        >
          <div class="movies-list--grid-item-image gradient">
            <aspect-ratio-box [aspectRatio]="W300H450.WIDTH / W300H450.HEIGHT">
              <img
                loading="lazy"
                [src]="movie.url"
                [width]="W300H450.WIDTH"
                [height]="W300H450.HEIGHT"
                alt="poster movie"
                [title]="movie.title"
              />
            </aspect-ratio-box>
          </div>
          <div class="movies-list--grid-item__details">
            <h2 class="movies-list--grid-item__details-title">
              {{ movie.title }}
            </h2>
            <star-rating [rating]="movie.vote_average"></star-rating>
          </div>
        </a>
        <div class="pagination"></div>
      </div>
    </ng-container>

    <ng-template #noData>
      <h3>
        No results
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <circle cx="15.5" cy="9.5" r="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"
          />
        </svg>
      </h3>
    </ng-template>
  `,
  styleUrls: ['./movie-list.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  W300H450 = W300H450;

  movies$ = this.state.select('movies').pipe(
    map(
      (movies) =>
        (movies || []).map((m) => ({
          ...m,
          url: `https://image.tmdb.org/t/p/w${W300H450.WIDTH}/${m.poster_path}`,
        })) as Movie[]
    )
  );

  hasMovies$ = this.state
    .select('movies')
    .pipe(map((movies) => !!movies && movies.length > 0));

  @Input('movies')
  set movies(movies$: Observable<MovieModel[]>) {
    this.state.connect('movies', movies$);
  }

  @Input() adult?: string;

  constructor(
    private router: Router,
    private state: RxState<{
      movies: MovieModel[];
    }>
  ) {}

  movieById(_: number, movie: Movie) {
    return movie.id;
  }

  toMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
