import { Observable } from 'rxjs';

export type RxInputType<T> = Observable<T | null> | T | null;
