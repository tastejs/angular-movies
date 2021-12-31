import { startWith, endWith, Observable } from 'rxjs';

export function withLoadingEmission<
  T extends object,
  K extends string | number | symbol = 'loading'
>(property = 'loading') {
  const start = { [property]: true } as unknown as T;
  const end = { [property]: false } as unknown as T;
  return (o$: Observable<T>): Observable<T | { [k in K]?: boolean }> =>
    o$.pipe(startWith(start), endWith(end));
}
