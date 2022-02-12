import { RxState } from '@rx-angular/state';
import { Directive, Input, Type, ViewContainerRef } from '@angular/core';
import { RxInputType } from '../../rxa-custom/input-type.typing';
import { coerceObservable } from '../../utils/coerceObservable';
import { distinctUntilChanged } from 'rxjs';

/**
 * @example
 * Component: (any-component.ts)
 *
 * export const imports = [RouterModule, CommonModule, ...];
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
  selector: '[lazy]',
})
export class LazyDirective extends RxState<{
  component: Type<any>;
}> {
  @Input()
  set lazy(component: RxInputType<Type<any>>) {
    this.connect('component', coerceObservable(component));
  }

  constructor(vCR: ViewContainerRef) {
    super();

    this.hold(
      // avoid recreation of a component with the same class (distinctUntilChanged)
      this.select('component').pipe(distinctUntilChanged()),
      (c) => {
        vCR.clear();
        vCR.createComponent(c);
      }
    );
  }
}
