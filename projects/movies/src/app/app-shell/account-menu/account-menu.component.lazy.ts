import { NgModule } from '@angular/core';
import { AccountMenuComponent, imports } from './account-menu.component';

/**
 * @NOTICE:
 *
 * To lazy load components you need to:
 * 0. in a new file `any.component.lazy.ts` (the name is irrelevant)
 * 1. create a module maintaining all it's dependencies over imports.
 * 2. declared the component as part of the module
 * 3. export the module
 * 4. export the component
 * 5. (bonus) avoid usage of the module by
 *  a. naming it as "_"
 *  b. add the @deprecated comment with a message
 */

/**
 *  @deprecated The module is here only for bundling reasons and should not be used // [5.b]
 */
@NgModule({
  imports, // [1]
  declarations: [AccountMenuComponent], // [2]
})
export class _ {} // [3], [5.a]

export const component = AccountMenuComponent; // [4]
