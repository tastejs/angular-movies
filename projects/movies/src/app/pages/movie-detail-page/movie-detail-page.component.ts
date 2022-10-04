import { select, selectSlice } from '@rx-angular/state/selections';
import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filter, map, mergeWith } from 'rxjs';
import { TMDBMovieCastModel } from '../../data-access/api/model/movie-credits.model';
import { TMDBMovieGenreModel } from '../../data-access/api/model/movie-genre.model';

import { MovieDetailAdapter } from './movie-detail-page.adapter';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RxEffects } from '@rx-angular/state/effects';
import { DetailGridComponent } from '../../ui/component/detail-grid/detail-grid.component';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';
import { MovieListComponent } from '../../ui/pattern/movie-list/movie-list.component';
import { LetModule } from '@rx-angular/template/let';
import { BypassSrcDirective } from '../../shared/bypass-src/bypass-src.directive';
import { ForModule } from '@rx-angular/template/for';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import { IfModule } from '../../shared/rxa-custom/if/src';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DetailGridComponent,
    StarRatingComponent,
    MovieListComponent,
    LetModule,
    BypassSrcDirective,
    ForModule,
    FastSvgModule,
    IfModule,
  ],
  selector: 'ct-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxEffects],
})
export class MovieDetailPageComponent {
  readonly ui = this.actionsF.create();
  private readonly movieCtx$ = this.adapter.routedMovieCtx$;
  readonly loadIframe$ = this.ui.iframe$.pipe(
    mergeWith(
      this.movieCtx$.pipe(
        // select changes of video nested property
        selectSlice(['value'], { value: ({ video }) => video })
      )
    ),
    map((e) => e === 'load')
  );
  readonly movie$ = this.movieCtx$.pipe(
    map((ctx) => ctx?.value || null),
    filter((movie) => !!movie)
  );
  readonly castList$ = this.adapter.movieCastById$;
  readonly castListLoading$ = this.adapter.movieCastById$.pipe(
    select('loading')
  );
  readonly infiniteScrollRecommendations$ =
    this.adapter.infiniteScrollRecommendations$;

  @ViewChild('trailerDialog')
  trailerDialog: ElementRef | undefined = undefined;

  @ViewChild('castListWrapper')
  castListWrapper: ElementRef<HTMLElement> | undefined = undefined;

  constructor(
    private effects: RxEffects,
    private location: Location,
    private adapter: MovieDetailAdapter,
    private actionsF: RxActionFactory<{
      dialog: 'show' | 'close';
      iframe: 'load' | 'unload';
    }>
  ) {
    this.effects.register(
      this.ui.dialog$.pipe(map((v) => v === 'show')),
      (openDialog) =>
        openDialog
          ? this.trailerDialog?.nativeElement?.showModal()
          : this.trailerDialog?.nativeElement.close()
    );
  }

  move(increment: number) {
    if (this.castListWrapper) {
      const scrollLeft = this.castListWrapper.nativeElement.scrollLeft;
      const newScrollLetf = scrollLeft - increment;
      this.castListWrapper.nativeElement.scrollLeft =
        newScrollLetf > 0
          ? Math.max(0, newScrollLetf)
          : Math.min(
              newScrollLetf,
              this.castListWrapper.nativeElement.children.length * increment
            );
    }
  }

  back() {
    this.location.back();
  }

  paginateRecommendations() {
    this.adapter.paginateRecommendations();
  }

  trackByGenre: TrackByFunction<TMDBMovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<TMDBMovieCastModel> = (_, cast) => cast.cast_id;
}
