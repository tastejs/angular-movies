import { from, map, Observable } from 'rxjs';
import { inject, Injector, Type } from '@angular/core';

export function lazyInject<T>(loader: () => Promise<Type<T>>): Observable<T> {
  const injector = inject(Injector);

  return from(loader()).pipe(map((service) => injector.get(service)));
}
