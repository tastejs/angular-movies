import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { W154H205 } from './image-sizes';
import { MY_LIST_FALLBACK, POSTER_FALLBACK } from '../../constants';

export const provideTmdbImageLoader = (
  cfg: { baseUrl: string } = { baseUrl: `https://image.tmdb.org/t/p/w` }
) => {
  const { baseUrl } = cfg;
  return {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      if (!config.width) {
        config.width = W154H205.WIDTH;
      }
      if (config.src === POSTER_FALLBACK) {
        return POSTER_FALLBACK;
      } else if (config.src === MY_LIST_FALLBACK) {
        return MY_LIST_FALLBACK;
      }
      return `${baseUrl}${config.width}${config.src}`;
    },
  };
};
