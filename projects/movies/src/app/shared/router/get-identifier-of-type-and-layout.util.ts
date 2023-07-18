import {filter, map, OperatorFunction, pipe} from 'rxjs';
import {RouterParams} from './router.model';

export const getIdentifierOfTypeAndLayoutUtil = (
  filterType: string,
  filterLayout = 'list'
): OperatorFunction<RouterParams, string> => {
  return pipe(
    filter(
      ({type, layout}: RouterParams) =>
        type === filterType && layout === filterLayout
    ),
    map(({ identifier }) => identifier)
  );
};
