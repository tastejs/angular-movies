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

const range = 10;
const numStars = 5;
const starsArray: number[] = new Array(numStars).fill(1);
/*
const starRating = document.createElement('DIV');
starRating.setAttribute('class', 'star-rating');

const stars = document.createElement('DIV');
stars.setAttribute('class', 'stars');

const star = document.createElement('SPAN');
star.setAttribute('class', 'star');
star.innerHTML = '★';

starsArray.forEach((fill) => {
  star.classList.toggle('star-half', fill === 0);
  star.classList.toggle('star-empty', fill === -1);
  stars.appendChild(star);
});

starRating.appendChild(stars);

const ratingValue = document.createElement('DIV');
ratingValue.setAttribute('class', 'rating-value');
ratingValue.innerHTML = '' + range;
*/

@Component({
  selector: 'star-rating',
  template: `
    <div class="star-rating">
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
  html: string;

  @Input('rating')
  set _rating(rating: number | undefined) {
    this.rating = rating || 0;
    const scaledRating =
      coerceNumberProperty(rating, 0) / (this.range / this.numStars);
    const full = Math.floor(scaledRating);
    const half = scaledRating % 1 > 0 ? 1 : 0;
    const empty = this.numStars - full - half;
    this.stars = new Array(full)
      .fill(1)
      .concat(new Array(half).fill(0))
      .concat(new Array(empty).fill(-1));

    // this.elem.nativeElement.appendChild(starRating);
  }

  @Input('showRating')
  set _showRating(show: boolean) {
    this.showRating = coerceBooleanProperty(show);
  }

  trackByIndex: TrackByFunction<number> = (idx) => idx;
}
