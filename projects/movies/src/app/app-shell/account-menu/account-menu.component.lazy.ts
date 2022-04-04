import { NgModule } from '@angular/core';
import {
  // organize your imports next to the component (like stand alone components)
  // e.g. `export const imports = [RouterModule, CommonModule, ...];`
  imports,
  AccountMenuComponent,
} from './account-menu.component';

/**
 * @NOTICE:
 *
 * To lazy load components you need to:
 * 0. in a new file `any.component.lazy.ts` next to the components file (the name is irrelevant)
 * 1. create a module maintaining all it's dependencies over imports.
 * 2. declared the component as part of the module
 * 3. export the module
 * 4. export the component under a const (export default is not working)
 * 5. (bonus) avoid usage of the module by
 *  a. naming it as "_"
 *  b. add the @deprecated comment with a message
 */

/**
 *  @deprecated The module is here only for bundling reasons and should not be used
 */ // [5.b]
@NgModule({
  imports, // [1]
  declarations: [AccountMenuComponent], // [2]
})
export class AccountMenuComponentModule {} // [3], [5.a]

// as the component is the only thing exported we can couly name it c to save characters
export const c = AccountMenuComponent; // [4]

/**
 Implementation:

 @Component({
  templates: `
    <ng-container *rxLet="accountMenuComponent$; rxSuspense: loading" [loadComponent]="c$">
    </ng-container>
    <ng-template #loading>
      Loading...
    </ng-template>
  `,
})
 export class AppShellComponent {
  readonly load = new Subject<void>();

  c$ = this.load.pipe(
    switchMap(() =>
      import('./any.component.lazy').then(({ c }) => c)
    ),
    shareReplay(1)
  );
  }
 */
