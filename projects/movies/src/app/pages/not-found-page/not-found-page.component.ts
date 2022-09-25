import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ct-not-found',
  template: ` <div class="not-found-container">
    <fast-svg size="350px" name="error"></fast-svg>
    <h1 class="title">Sorry, page not found</h1>
    <a class="btn" routerLink="/list/category/popular">See popular</a>
  </div>`,
  styleUrls: ['./not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class NotFoundPageComponent {}
