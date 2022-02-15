// @TODO: This information should get fetched from the TMDB API

import { ImageDimensions } from './image-dimensions.interface';

export const W44H44: ImageDimensions = {
  WIDTH: 44,
  HEIGHT: 44,
} as const;

export const W300H450: ImageDimensions = {
  WIDTH: 300,
  HEIGHT: 450,
} as const;

export const W342H513: ImageDimensions = {
  WIDTH: 342,
  HEIGHT: 513,
} as const;

export const W780H1170: ImageDimensions = {
  WIDTH: 780,
  HEIGHT: 1170,
} as const;

export const W185H278: ImageDimensions = {
  WIDTH: 185,
  HEIGHT: 278,
} as const;

export const W500H282: ImageDimensions = {
  WIDTH: 500,
  HEIGHT: 282,
} as const;

export const W92H138: ImageDimensions = {
  WIDTH: 92,
  HEIGHT: 138,
} as const;

export const W355H200: ImageDimensions = {
  WIDTH: 355,
  HEIGHT: 200,
} as const;

export const W355_AND_H200_BESTV2: ImageDimensions = {
  FULL: 'w355_and_h200_bestv2',
  WIDTH: 355,
  HEIGHT: 200,
} as const;

export const W710_AND_H400_BESTV2: ImageDimensions = {
  FULL: 'w700_and_h400_bestv2',
  WIDTH: 700,
  HEIGHT: 400,
} as const;
