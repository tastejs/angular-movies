import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { PersonDetailAdapter, PersonDetailPageAdapterState } from './person-detail-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [RxState]
})
export class PersonDetailPageComponent {
  readonly detailState$ = this.state.select(
    selectSlice(['loading', 'person'])
  );
  readonly recommendedLoading$ = this.state.select('loading');
  readonly recommendations$ = this.state.select('recommendations');

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter,
    private state: RxState<PersonDetailPageAdapterState>
  ) {
    this.state.set({
      recommendations: [],
      loading: true
    });
    this.state.connect(this.adapter.routedPersonSlice$);
    this.state.connect('recommendations', this.adapter.movieRecommendationsById$);
  }

  back() {
    this.location.back();
  }
}
