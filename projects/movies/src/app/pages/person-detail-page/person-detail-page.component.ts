import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { PersonDetailAdapter } from './person-detail-page.adapter';
import { SORT_VALUES } from '../../data-access/api/sort/sort.data';
import { merge } from 'rxjs';
import { DetailGridComponent } from '../../ui/component/detail-grid/detail-grid.component';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';
import { MovieListComponent } from '../../ui/pattern/movie-list/movie-list.component';
import { LetModule } from '@rx-angular/template/let';
import { FastIconModule } from '../../shared/fast-icon/fast-icon.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailGridComponent,
    StarRatingComponent,
    MovieListComponent,
    LetModule,
    FastIconModule,
  ],
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PersonDetailPageComponent {
  sortOptions = SORT_VALUES;
  readonly personCtx$ = this.adapter.routedPersonCtx$;
  readonly sortingModel$ = this.adapter.sortingModel$;

  readonly sortBy = this.adapter.sortBy;
  readonly toggleSorting = this.adapter.toggleSorting;
  readonly infiniteScrollRecommendations$ = merge(
    this.adapter.movieRecommendationsById$,
    this.adapter.sortingEvent$
  );

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter
  ) {
    this.adapter.set({
      activeSorting: this.sortOptions[0].name,
      showSorting: false,
    });
  }

  paginate(): void {
    this.adapter.paginate();
  }

  back() {
    this.location.back();
  }
}
