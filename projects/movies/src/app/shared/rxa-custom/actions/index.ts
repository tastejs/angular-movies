import { map, Observable, Subject } from 'rxjs';

type InstanceOrType<T> = T extends abstract new (... args: unknown[]) => infer R ? R : T;

export type ActionAccess<T extends { [x: string]: any }> = {
  [K in keyof T]: (arg: InstanceOrType<T[K]>) => void;
} & {
  [K in Extract<keyof T, string> as `${K}$`]: Observable<InstanceOrType<T[K]>>;
};

/**
 * Returns a object based off of the provided typing with a separate setter `[prop](value: T[K]): void` and observable stream `[prop]$: Observable<T[K]>`;
 *
 * { search: string } => { search$: Observable<string>, search: (value: string) => void;}
 *
 * @example
 *
 * const actions = getActions<search: string, submit: void>({search: (e) => e.target.value});
 *
 * actions.search($event);
 * actions.search$ | async;
 *
 * @param transforms map of transform functions to apply on certain properties if they are set.
 */
export function getActions<T extends object>(transforms?: Partial<{ [K in keyof T]: (e?: any) => T[K] }>): ActionAccess<T> {
  type K = keyof T;
  const _transforms = transforms !== undefined ? transforms : {} as any;
  const subjects = new Map<string, Subject<T[K]>>();
  const observables = new Map<string, Observable<T[K]>>();

  const handler: ProxyHandler<ActionAccess<T>> = {
    get(_, property: string) {

      if (property.toString().split('').pop() === '$') {
        const propName: string | number | Symbol = property.toString().slice(0, -1);
        if (!subjects.has(propName)) {
          subjects.set(propName, new Subject<T[K]>());
        }
        if (!observables.has(propName)) {
          observables.set(propName, (subjects.get(propName) as Subject<T[K]>).pipe(
            map((v) => (_transforms[propName] ? _transforms[propName](v) : v)))
          );
        }

        return observables.get(propName);
      }

      return (args: T[K]) => {
        if (!subjects.has(property)) {
          subjects.set(property, new Subject<T[K]>());
        }
        subjects.get(property)?.next(args);
      };
    },
    set() {
      throw new Error('No setters available. To emit call the property name.');
    }
  };

  return new Proxy({} as ActionAccess<T>, handler);
}
