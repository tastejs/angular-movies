import { Directive, Input, Type, ViewContainerRef } from '@angular/core';
import { RxInputType } from '../../rxa-custom/input-type.typing';
import { RxState } from '@rx-angular/state';
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
  selector: '[loadComponent]',
})
export class LazyComponentDirective extends RxState<{
  component: Type<any>;
}> {
  @Input()
  set loadComponent(component: RxInputType<Type<any>>) {
    this.connect('component', coerceObservable(component));
  }

  constructor(viewContainerRef: ViewContainerRef) {
    super();

    this.hold(
      // avoid recreation of a component with the same class (distinctUntilChanged)
      this.select('component').pipe(distinctUntilChanged()),
      (component) => {
        viewContainerRef.clear();
        viewContainerRef.createComponent(component);
      }
    );
  }
}
