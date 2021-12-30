import { endWith, Observable, startWith } from 'rxjs';

export function withLoadingEmission<T extends object>(property: Extract<keyof T, string>, startValue: T[keyof T], endValue: T[keyof T]) {
  const start = { [property]: startValue } as unknown as T;
  const end = { [property]: endValue } as unknown as T;
  return (o$: Observable<T>): Observable<T> => o$.pipe(
    startWith(start),
    endWith(end)
  ) as Observable<T>;
}
