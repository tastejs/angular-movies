import {IMAGE_LOADER, ImageLoaderConfig} from '@angular/common';
import {W154H205} from '../constants/image-sizes';
import {POSTER_FALLBACK} from "../../../shared/cdk/image/constants";


const baseUrl = `https://image.tmdb.org/t/p/w`;

export function provideMovieDbImageLoader() {
  return {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      if(!config.width) {
        config.width = W154H205.WIDTH;
      }
      if(config.src === POSTER_FALLBACK) {
        return POSTER_FALLBACK
      }
      return `${baseUrl}${config.width}${config.src}`;
    }
  }
}
