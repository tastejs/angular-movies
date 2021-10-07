import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
} from '@angular/core';
import {
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import { trackByIndex } from '../../../shared/utils/track-by';

const range = 10;
const numStars = 5;
const starsArray: number[] = new Array(numStars).fill(1);

@Component({
  selector: 'star-rating',
  template: `
    <div class="star-rating">
      <span class="tooltip">
        {{ tooltipText }}
      </span>
      <div class="stars">
        <span
          *ngFor="let fill of stars; trackBy: trackByIndex"
          class="star"
          [ngClass]="{
            'star-half': fill === 0,
            'star-empty': fill === -1
          }"
          style
          >★</span
        >
      </div>
      <div class="rating-value" *ngIf="showRating">{{ rating }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  range = range;
  numStars = numStars;
  stars: number[] = starsArray;
  rating = 5;
  showRating = false;
  tooltipText = `0 average rating`;
  trackByIndex: TrackByFunction<number> = trackByIndex();

  @Input('rating')
  set _rating(rating: number | undefined) {
    this.rating = rating || 0;

    this.setToolTopText(this.rating);

    const scaledRating =
      coerceNumberProperty(rating, 0) / (this.range / this.numStars);
    const full = Math.floor(scaledRating);
    const half = scaledRating % 1 > 0 ? 1 : 0;
    const empty = this.numStars - full - half;
    this.stars = new Array(full)
      .fill(1)
      .concat(new Array(half).fill(0))
      .concat(new Array(empty).fill(-1));
  }

  setToolTopText(rating: number) {
    this.tooltipText = `${rating} average rating`;
  }

  @Input('showRating')
  set _showRating(show: boolean) {
    this.showRating = coerceBooleanProperty(show);
  }
}
