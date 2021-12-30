import { Injector } from '@angular/core';

let InjectorInstance: Injector;

export function setInjector(i: Injector): void {
  if(!InjectorInstance) {
    InjectorInstance = i;
  } else {
    throw new Error('set injector only once')
  }
}

export function getInjector(): Injector {
return InjectorInstance;
}
