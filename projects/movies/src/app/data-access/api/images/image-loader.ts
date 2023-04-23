import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common';
import {W154H205} from '../constants/image-sizes';


const baseUrl = `https://image.tmdb.org/t/p/w`;

export function provideMovieDbImageLoader() {
  return {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      config.width || (config.width = W154H205.WIDTH);
      return `${baseUrl}${config.width}${config.src}`;
    }
  }
}