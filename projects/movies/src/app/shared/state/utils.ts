import { filter, map, OperatorFunction, pipe } from 'rxjs';
import { RouterParams } from '../router/router.model';

export const getIdentifierOfTypeAndLayout = (
  filterType: string,
  filterLayout: string = 'list'
): OperatorFunction<RouterParams, string> => {
  return pipe(
    filter(
      ({ type, layout }: RouterParams) =>
        type === filterType && layout === filterLayout
    ),
    map(({ identifier }) => identifier)
  );
};
