export type DefaultLoadingProp = string & 'loading';
export type LoadingState<K extends string | DefaultLoadingProp> = {
  [k in K]: boolean;
};
