import { isObservable, Observable, ObservableInput, of } from 'rxjs';

export function coerceObservable<T>(o: ObservableInput<T> | T): Observable<T> {
  return (isObservable(o) ? o : of(o)) as Observable<T>;
}
