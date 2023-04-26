import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FastSvgModule } from '@push-based/ngx-fast-svg';

@Component({
  standalone: true,
  imports:  [FastSvgModule],
  selector: 'ct-not-found',
  template: ` <div class="not-found-container">
    <fast-svg size="350px" name="error"></fast-svg>
    <h1 class="title">Sorry, page not found</h1>
    <a class="btn" routerLink="/list/category/popular">See popular</a>
  </div>`,
  styles: [`
    @import '../../ui/component/button/button';
    @import '../../ui/token/mixins/flex';

    :host {
      width: 100%;
      height: 100%;
      display: block;
    }

    .not-found-container {
      @include d-flex-vh;
      flex-direction: column;
    }

    .title {
      text-align: center;
      font-size: 4rem;
      font-weight: 700;
      margin: 3rem 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class NotFoundPageComponent {}
