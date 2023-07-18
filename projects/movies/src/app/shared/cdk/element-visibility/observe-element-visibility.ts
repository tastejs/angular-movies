import {distinctUntilChanged, isObservable, Observable, takeUntil,} from 'rxjs';

export function observeElementVisibility(
  element: HTMLElement,
  cfg?: {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
    stop$?: Observable<unknown>;
  }
): Observable<boolean> {
  const { stop$, ..._cgf } = cfg || {};
  return new Observable<boolean>((subscriber) => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        subscriber.next(entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: '500px',
        threshold: 0.5,
        ..._cgf,
      }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }).pipe(
    // only forward changes in visibility
    distinctUntilChanged(),
    isObservable(stop$) ? takeUntil(stop$) : (o) => o
  );
}
