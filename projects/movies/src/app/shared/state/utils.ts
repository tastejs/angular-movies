import { filter, map, OperatorFunction, pipe } from 'rxjs';
import { RouterParams } from './router-state.interface';

export const getIdentifierOfTypeAndLayout = (filterType: string, filterLayout: string = 'list'): OperatorFunction<RouterParams, string> => {
  return pipe(
    filter(({ type, layout }: RouterParams) => type === filterType && layout === filterLayout), map(({ identifier }) => identifier)
  );
};
