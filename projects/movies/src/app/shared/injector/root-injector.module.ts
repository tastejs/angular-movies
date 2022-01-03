import { Injector, NgModule } from '@angular/core';

let InjectorInstance: Injector;

/**
 * Import this module to get a global shorthand to the root injector.
 *
 * @example
 * @NgModule({
 *   imports: [
 *     InjectorShortcutModule
 *   ]
 * })
 *
 * const http = getInjector().get(HttpClient);
 *
 */
@NgModule({})
export class RootInjectorShortcutModule {
  constructor(injector: Injector) {
    if (!InjectorInstance) {
      InjectorInstance = injector;
    } else {
      console.error('set injector only once');
    }
  }
}

/**
 * Shorthand to get a global service instance
 *
 * @example
 * import { HttpClient } from '@angular/common/http';
 *
 * // Notice, you have to import `InjectorShortcutModule` in the app module before you can use it
 * const http = getInjector().get(HttpClient);
 *
 */
export function getInjector(): Injector {
  return InjectorInstance;
}
