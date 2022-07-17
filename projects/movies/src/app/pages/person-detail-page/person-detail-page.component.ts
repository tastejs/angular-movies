import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { PersonDetailAdapter } from './person-detail-page.adapter';
import { SORT_VALUES } from '../../data-access/api/sort/sort.data';
import { merge, tap } from 'rxjs';

import { Link } from '../../shared/link/link.service';

@Component({
  selector: 'ct-person',
  templateUrl: './person-detail-page.component.html',
  styleUrls: ['./person-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PersonDetailPageComponent {
  sortOptions = SORT_VALUES;
  readonly personCtx$ = this.adapter.routedPersonCtx$.pipe(
    tap((actor) => this.preloadLCPImage(actor?.value?.imgUrl || null))
  );
  readonly sortingModel$ = this.adapter.sortingModel$;

  readonly sortBy = this.adapter.sortBy;
  readonly toggleSorting = this.adapter.toggleSorting;
  readonly infiniteScrollRecommendations$ = merge(
    this.adapter.movieRecommendationsById$,
    this.adapter.sortingEvent$
  );

  constructor(
    private location: Location,
    private adapter: PersonDetailAdapter,
    private linkService: Link
  ) {
    this.adapter.set({
      activeSorting: this.sortOptions[0].name,
      showSorting: false,
    });
  }

  private preloadLCPImage(href: string | null): void | null {
    if (!href) return null;
    const preloadLink = {
      rel: "preload", as: "image", type:"image/jpeg", href: href
    }
    this.linkService.addTag(preloadLink);
  }

  paginate(): void {
    this.adapter.paginate();
  }

  back() {
    this.location.back();
  }
}
