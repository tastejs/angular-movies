import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { PersonDetailAdapter } from './person-detail-page.adapter';
import { SORT_VALUES } from '../../data-access/api/sort/sort.data';
import { getActions } from '../../shared/rxa-custom/actions';
import { TBDMSortByValues } from '../../data-access/api/sort/sort.interface';
import { tap } from 'rxjs';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PersonDetailPageComponent {
  sortOptions = SORT_VALUES;
  ui = getActions<{ sort: TBDMSortByValues }>({
    sort: (e: any): TBDMSortByValues => e.target.value as TBDMSortByValues,
  });
  readonly personCtx$ = this.adapter.routedPersonCtx$;
  readonly infiniteScrollRecommendations$ =
    this.adapter.movieRecommendationsById$.pipe(
      tap((v) => console.log('infiniteResult', v))
    );

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter
  ) {
    this.adapter.sortBy(this.ui.sort$);
  }

  paginate(): void {
    this.adapter.paginate();
  }

  back() {
    this.location.back();
  }
}
