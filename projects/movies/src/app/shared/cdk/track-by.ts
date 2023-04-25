import { TrackByFunction } from '@angular/core';

export const trackByProp: <T>(prop: keyof T) => TrackByFunction<T> =
  <T>(prop: keyof T) =>
  (_: number, item: T) =>
    item[prop];
export const trackByIndex: () => TrackByFunction<number> =
  () => (index: number) =>
    index;
