import { RxState } from '@rx-angular/state';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { TMDBMovieModel } from '../../../data-access/api/model/movie.model';
import { W300H450 } from '../../../data-access/api/constants/image-sizes';
import { ImageTag } from '../../../shared/utils/image/image-tag.interface';
import { addImageTag } from '../../../shared/utils/image/image-tag.transform';
import { getActions } from '../../../shared/rxa-custom/actions';
import { coerceObservable } from '../../../shared/utils/coerceObservable';
import { RxInputType } from '../../../shared/rxa-custom/input-type.typing';

type Movie = TMDBMovieModel & ImageTag;

@Component({
  selector: 'ui-movie-list',
  template: `
    <ng-container *rxLet="moviesListVisible$; let moviesListVisible">
      <ui-grid-list *ngIf="moviesListVisible; else noData">
        <!--
            **🚀 Perf Tip for TBT:**
            Use \`rxFor\` in favour of \`ngFor\` to get non blocking rendering of lists.
            This reduces drastically the TBT measure.
        -->
        <a
          class="ui-grid-list-item"
          *rxFor="let movie of movies$; index as idx; trackBy: trackByMovieId"
          [routerLink]="['/detail/movie', movie.id]"
          [attr.data-uf]="'ui-movie-list--movie--' + idx"
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
        <!-- If this element is visible in the viewport the paginate event fires -->
        <div (elementVisibility)="ui.paginate($event)"></div>
      </ui-grid-list>

      <ng-template #noData>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 1.5rem">No results</span>
          <svg-icon name="sad"></svg-icon>
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
  ui = getActions<{ paginate: boolean }>();

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
  set movies(movies$: RxInputType<TMDBMovieModel[] | null | undefined>) {
    this.state.connect('movies', coerceObservable(movies$));
  }

  // emit paginate event only if element is visible (true)
  @Output() readonly paginate: Observable<true> = this.ui.paginate$.pipe(
    filter(Boolean)
  );

  constructor(
    private state: RxState<{ movies?: TMDBMovieModel[] | null | undefined }>
  ) {}

  trackByMovieId(_: number, movie: Movie) {
    return movie.id;
  }
}
