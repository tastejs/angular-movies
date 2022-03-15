/**
 * @internal
 * Internal helper to create the proxy object
 * It lifes as standalone function because we dont need to carrie it in memory for every ActionHandler instance
 * @param subjects
 * @param transforms
 */
import { Subject } from 'rxjs';
import { KeysOf, ValuesOf, RxActions } from './types';
import { ErrorHandler } from '@angular/core';

export function actionProxyHandler<T extends object, U>(
  subjects: { [K in keyof T]: Subject<ValuesOf<T>> },
  transforms?: U,
  errorHandler?: ErrorHandler
): ProxyHandler<RxActions<T, U>> {
  type KeysOfT = KeysOf<T>;
  type ValuesOfT = ValuesOf<T>;

  function dispatch(value: ValuesOfT, prop: KeysOfT) {
    subjects[prop] = subjects[prop] || new Subject<ValuesOfT>();
    try {
      const val =
        transforms && (transforms as any)[prop]
          ? (transforms as any)[prop](value)
          : value;
      subjects[prop].next(val);
    } catch (err) {
      errorHandler?.handleError(err);
    }
  }

  return {
    // shorthand setter for multiple signals e.g. {propA: 1, propB: 2}
    apply(_: RxActions<T, U>, __: any, props: [T]): any {
      props.forEach((slice) =>
        Object.entries(slice).forEach(([k, v]) =>
          dispatch(v, k as any as KeysOfT)
        )
      );
    },
    get(_, property: string) {
      const prop = property as KeysOfT;

      // the user wants to get a observable
      if (prop.toString().split('').pop() === '$') {
        const propName = prop.toString().slice(0, -1) as KeysOfT;
        subjects[propName] = subjects[propName] || new Subject<ValuesOfT>();
        return subjects[propName];
      }

      // the user wants to get a dispatcher function
      return (args: ValuesOfT) => {
        dispatch(args, prop);
      };
    },
    set() {
      throw new Error('No setters available. To emit call the property name.');
    },
  };
}
