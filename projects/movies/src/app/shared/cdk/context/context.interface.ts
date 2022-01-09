import { LoadingState } from '../loading/loading-state.interface';

export type DefaultLoadingProp = string & 'loading';
export type WithContext<T> = LoadingState & {
  value: T;
  error?: any;
  complete?: any;
};
