import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { map, Observable } from 'rxjs';
import { MovieModel } from '../../../data-access/model/movie.model';
import { W300H450 } from '../../../data-access/configurations/image-sizes';
import { ImageTag } from '../../../shared/utils/image-object';

type Movie = MovieModel & ImageTag;

@Component({
  selector: 'app-movie-list',
  template: `
    <ng-content select='.header'></ng-content>
    <ng-container
      *rxLet="hasMovies$; let hasMovies; strategy: 'instantUserBlocking'"
    >
      <div class='movies-list--grid' *ngIf='hasMovies; else noData' data-test="list-container">
        <a
          class='movies-list--grid-item'
          *rxFor='let movie of (movies$); index as idx; trackBy: trackByMovieId; '
          [href]="'/movie/' + movie.id"
          (click)='$event.preventDefault(); navigateToMovie(movie)'
          [attr.data-test]="'list-item-idx-'+idx"
        >
          <div class='movies-list--grid-item-image gradient'>
            <app-aspect-ratio-box [aspectRatio]='movie.imgWidth / movie.imgHeight'>
              <!--
              **🚀 Perf Tip for LCP:**
              To get out the best performance use the native HTML attribute loading="lazy" instead of a directive.
              This avoids bootstrap and template evaluation time and reduces scripting time in general.
              -->
              <img
                [attr.loading]="idx === 0 ? '' : 'lazy'"
                [src]='movie.url'
                [width]='movie.imgWidth'
                [height]='movie.imgHeight'
                alt='poster movie'
                [title]='movie.title'
              />
            </app-aspect-ratio-box>
          </div>
          <div class='movies-list--grid-item__details'>
            <h2 class='movies-list--grid-item__details-title'>
              {{ movie.title }}
            </h2>
            <app-star-rating [rating]='movie.vote_average'></app-star-rating>
          </div>
        </a>
        <div class='pagination'></div>
      </div>
    </ng-container>

    <ng-template #noData>
      <h3 data-test="list-empty">
        No results
        <svg class='icon' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M0 0h24v24H0V0z' fill='none' />
          <circle cx='15.5' cy='9.5' r='1.5' />
          <circle cx='8.5' cy='9.5' r='1.5' />
          <path
            d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z'
          />
        </svg>
      </h3>
    </ng-template>
  `,
  styleUrls: ['./movie-list.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {

  movies$ = this.state.select(
    map(
      /**
       *
       * @TODO remove spread and use for loop
       */
      (state) =>
        (state.movies || []).map((m) => ({
          ...m,
          url: `https://image.tmdb.org/t/p/w${W300H450.WIDTH}/${m.poster_path}`,
          imgWidth: W300H450.WIDTH,
          imgHeight: W300H450.HEIGHT
        })) as Movie[]
    )
  );

  hasMovies$ = this.state
    .select(map((state) => !!state.movies && state.movies.length > 0));

  @Input()
  set movies(movies$: Observable<MovieModel[]>) {
    this.state.connect('movies', movies$);
  }

  constructor(
    private router: Router,
    private state: RxState<{
      movies: MovieModel[];
    }>
  ) {
  }

  trackByMovieId(_: number, movie: Movie) {
    return movie.id;
  }

  navigateToMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
