import {
  coalesceWith,
  RxStrategyCredentials,
  RX_CONCURRENT_STRATEGIES,
} from '@rx-angular/cdk';
import { from, merge } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';

const instantUserBlocking: RxStrategyCredentials = {
  name: 'instantUserBlocking',
  work: (cdRef) => cdRef.detectChanges(),
  behavior: (work: any, scope: any) => {
    return (o$) =>
      merge(
        o$.pipe(
          take(1),
          tap(() => work())
        ),
        o$.pipe(
          skip(1),
          RX_CONCURRENT_STRATEGIES.userBlocking.behavior(work, scope)
        )
      );
  },
};

export const customStrategyCredentials = {
  asap: createAsapStrategyCredentials(),
  instantUserBlocking,
};

function createAsapStrategyCredentials(): RxStrategyCredentials {
  return {
    name: 'asap',
    work: (cdRef) => {
      cdRef.detectChanges();
    },
    behavior: (work: any, scope: any) => {
      return (o$) =>
        o$.pipe(
          coalesceWith(from(Promise.resolve()), scope),
          tap(() => work())
        );
    },
  };
}
