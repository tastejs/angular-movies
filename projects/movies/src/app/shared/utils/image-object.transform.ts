import { ImageTag } from './image-tag.interface';
import { ImageDimensions } from '../../data-access/configurations/image-dimensions.interface';

export function addImageTag<T extends Object>(_res: T, options: { pathProp: keyof T, dims: ImageDimensions, fallback?: string, baseUrl?: string }): T & ImageTag {
  let { pathProp, fallback, baseUrl, dims } = options;
  baseUrl = baseUrl || `https://image.tmdb.org/t/p/w`;
  fallback = fallback || `assets/images/no_poster_available.jpg`;

  const res = _res as T & ImageTag;

  res.url = res[pathProp] ? `${baseUrl}${dims.WIDTH}/${res[pathProp]}` : fallback;
  res.imgWidth = dims.WIDTH;
  res.imgHeight = dims.HEIGHT;
  res.imgRatio = res.imgWidth / res.imgHeight;

  return res;
}
