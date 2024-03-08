import { rxState } from '@rx-angular/state';
import {
  Directive,
  inject,
  Input,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { RxInputType } from '../../cdk/input-type.typing';
import { coerceObservable } from '../../cdk/coerceObservable';
import { distinctUntilChanged } from 'rxjs';
import { rxEffects } from '@rx-angular/state/effects';

/**
 * @example
 * Component: (any-component.ts)
 *
 * export const imports = [RouterOutlet, CommonModule, ...];
 * @Component({
 * ...
 * })
 * export class AnyComponent {}
 *
 * File to import from: (any-component.lazy.ts)
 *
 * import { NgModule } from '@angular/core';
 * import { AccountMenuComponent, imports } from './account-menu.component';
 * export const component = AccountMenuComponent;
 * @NgModule({ declarations: [component], imports })
 * export class _ {}
 *
 * Loader Component: other-component.ts
 * import('./any-component.lazy.ts').then(c => c.component)
 */
@Directive({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[lazy]',
})
export class LazyDirective {
  private readonly state = rxState<{ component: Type<unknown> }>();
  private readonly vCR: ViewContainerRef = inject(ViewContainerRef);
  constructor() {
    rxEffects((e) =>
      e.register(
        // avoid recreation of a component with the same class (distinctUntilChanged)
        this.state.select('component').pipe(distinctUntilChanged()),
        (c) => {
          this.vCR.clear();
          this.vCR.createComponent(c);
        }
      )
    );
  }
  @Input({ required: true })
  set lazy(component: RxInputType<Type<unknown>>) {
    // eslint-disable-next-line @rx-angular/no-rxstate-subscriptions-outside-constructor
    this.state.connect('component', coerceObservable(component));
  }
}
