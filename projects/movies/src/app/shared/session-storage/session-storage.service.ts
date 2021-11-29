import { Injectable } from '@angular/core';
import { RxStrategyProvider } from '@rx-angular/cdk';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  constructor(
    private strategyProvider: RxStrategyProvider
  ) {
  }

  /**
   **🚀 Perf Tip:**
   Use low priority scheduling for work that is not directly related to visual user feedback.
   You can use requestIdleCallback or a more advanced technique that in addition to using a low prio also ensures that no frame drop occurs.
   */
  executeWithLowPrio<T>(work: () => T): Observable<T> {
    return this.strategyProvider.schedule(
      work,
      {strategy: 'idle'}
    );
  }

  setItem(key: string, data: string): Observable<void> {
    return this.executeWithLowPrio(() => sessionStorage.setItem(key, data));
  }

  getItem(key: string): Observable<string | null> {
    return this.executeWithLowPrio(() => sessionStorage.getItem(key));
  }

  removeItem(key: string): Observable<void> {
    return this.executeWithLowPrio(() => sessionStorage.removeItem(key));
  }

  clear(): Observable<void> {
    return  this.executeWithLowPrio(() => sessionStorage.clear());
  }
}
