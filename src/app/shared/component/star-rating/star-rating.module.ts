import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StarRatingComponent} from './star-rating.component';

@NgModule({
  declarations: [StarRatingComponent],
  imports: [CommonModule],
  exports: [StarRatingComponent],
})
export class StarRatingModule {
}
