import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { PersonDetailAdapter } from './person-detail-page.adapter';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PersonDetailPageComponent {
  readonly personCtx$ = this.adapter.routedPersonCtx$;
  readonly infiniteScrollRecommendations$ =
    this.adapter.movieRecommendationsById$;

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter
  ) {}

  paginate(): void {
    this.adapter.paginate();
  }

  back() {
    this.location.back();
  }
}
