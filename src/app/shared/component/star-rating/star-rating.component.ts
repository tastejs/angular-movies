import {ChangeDetectionStrategy, Component, Input, TrackByFunction} from '@angular/core';
import {coerceBooleanProperty, coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'star-rating',
  template: `
    <div class="star-rating">
      <div class="stars">
        <span *ngFor="let fill of stars; trackBy: trackByIndex" class="star" [ngClass]="{
        'star-half': fill === 0,
        'star-empty': fill === -1
        }" style>★</span>
      </div>
      <div class="rating-value" *ngIf="showRating">{{rating}}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent {
  range = 10;
  numStars = 5;
  stars: number[] = new Array(this.numStars).fill(1);
  rating = 5;
  showRating = false;

  @Input('rating')
  set _rating(rating: number) {
    this.rating = rating;
    const scaledRating = coerceNumberProperty(rating, 0) / (this.range / this.numStars);
    const full = Math.floor(scaledRating);
    const half = scaledRating % 1 > 0 ? 1 : 0;
    const empty = this.numStars - full - half;
    this.stars = new Array(full).fill(1)
        .concat(new Array(half).fill(0))
        .concat(new Array(empty).fill(-1));
  }

  @Input('showRating')
  set _showRating(show: boolean) {
    this.showRating = coerceBooleanProperty(show);
  }

  trackByIndex: TrackByFunction<number> = (idx) => idx;
}
