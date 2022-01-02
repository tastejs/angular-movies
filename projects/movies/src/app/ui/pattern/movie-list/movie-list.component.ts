import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { filter, map, Observable, tap } from 'rxjs';
import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { W300H450 } from '../../../data-access/configurations/image-sizes';
import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../../shared/utils/image/image-tag.transform';
import { getActions } from '../../../shared/rxa-custom/actions';

type Movie = TMDBMovieModel & ImageTag;

@Component({
  selector: 'ui-movie-list',
  template: `
    <ng-container
      *rxLet="
        moviesListVisible$;
        let moviesListVisible;
        renderCallback: { next: ui.moviesVisibleRenderCallback }
      "
    >
      <div
        class="movies-list--grid"
        *ngIf="moviesListVisible; else noData"
        data-test="list-container"
      >
        <!--
            **🚀 Perf Tip for TBT:**
            Use \`rxFor\` in favour of \`ngFor\` to get non blocking rendering of lists.
            This reduces drastically the TBT measure.
            -->
        <a
          class="movies-list--grid-item"
          *rxFor="let movie of movies$; index as idx; trackBy: trackByMovieId"
          (click)="$event.preventDefault(); navigateToMovie(movie)"
          [attr.data-test]="'list-item-idx-' + idx"
        >
          <!--
            **🚀 Perf Tip for LCP:**
            To get out the best performance use the native HTML attribute loading="lazy" instead of a directive.
            This avoids bootstrap and template evaluation time and reduces scripting time in general.
            -->
          <img
            class="aspectRatio-2-3 gradient"
            [attr.loading]="idx === 0 ? '' : 'lazy'"
            [src]="movie?.imgUrl || 'assets/images/no_poster_available.jpg'"
            [width]="movie.imgWidth"
            [height]="movie.imgHeight"
            alt="poster movie"
            [title]="movie.title"
          />
          <div class="movies-list--details">
            <h3 class="movies-list--details-title">
              {{ movie.title }}
            </h3>
            <ui-star-rating [rating]="movie.vote_average"></ui-star-rating>
          </div>
        </a>
        <div (elementVisibility)="ui.paginate($event)" class="pagination"></div>
      </div>

      <ng-template #noData>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 1.5rem">No results</span>
          <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <circle cx="15.5" cy="9.5" r="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z"
            />
          </svg>
        </div>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./movie-list.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MovieListComponent {
  @ViewChild('paginateEl') paginateEl?: ElementRef<HTMLElement>;

  ui =
    getActions<{ paginate: boolean; moviesVisibleRenderCallback: boolean }>();

  readonly movies$ = this.state.select(
    map((state) =>
      (state.movies || []).map((m: TMDBMovieModel) =>
        addImageTag(m, { pathProp: 'poster_path', dims: W300H450 })
      )
    )
  );

  // if no movies are given we don't need to render nor listen for the infinite scroll trigger
  readonly moviesListVisible$ = this.state.select(
    map((state) => !!state.movies && state.movies.length > 0)
  );

  @Input()
  set movies(movies$: Observable<TMDBMovieModel[]>) {
    this.state.connect('movies', movies$);
  }

  // emit paginate event only if element is visible
  @Output() readonly paginate = this.ui.paginate$.pipe(
    tap(console.log),
    filter(Boolean)
  );

  constructor(
    private router: Router,
    private state: RxState<{ movies: TMDBMovieModel[] }>
  ) {}

  trackByMovieId(_: number, movie: Movie) {
    return movie.id;
  }

  navigateToMovie(movie: Movie) {
    this.router.navigate(['/detail/movie', movie.id]);
  }
}
