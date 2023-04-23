import { Observable } from 'rxjs';

export type RxInputType<T> = Observable<T> | T;
