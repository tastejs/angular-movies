import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { map } from 'rxjs';
import {
  PersonDetailAdapter,
  PersonDetailPageAdapterState,
} from './person-detail-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState],
})
export class PersonDetailPageComponent {
  readonly detailState$ = this.state.select(selectSlice(['loading', 'person']));
  readonly recommendedLoading$ = this.state.select('loading');
  readonly recommendations$ = this.state.select('recommendations');

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter,
    private state: RxState<PersonDetailPageAdapterState>
  ) {
    this.state.connect(this.adapter.routedPersonSlice$);
    this.state.connect(
      'recommendations',
      this.adapter.movieRecommendationsById$.pipe(map((r) => r.results || []))
    );
  }

  paginate(): void {
    this.adapter.paginate();
  }

  back() {
    this.location.back();
  }
}
