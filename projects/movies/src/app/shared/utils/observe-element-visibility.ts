import { Observable } from 'rxjs';

export function observeElementVisibility(
  element: HTMLElement,
  cfg?: {
    root: null;
    rootMargin: string;
    threshold: number;
  }
): Observable<boolean> {
  return new Observable<boolean>((subscriber) => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        subscriber.next(entries[0].isIntersecting);
      },
      {
        root: null,
        rootMargin: '500px',
        threshold: 0.5,
        ...(cfg || {}),
      }
    );
    observer.observe(element);
    return () => observer.disconnect();
  });
}
