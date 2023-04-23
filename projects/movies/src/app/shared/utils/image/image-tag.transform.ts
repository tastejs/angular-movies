import {ImageTag} from './image-tag.interface';
import {ImageDimensions} from '../../../data-access/api/constants/image-dimensions.interface';

export function addImageTag<T extends Object>(
  _res: T,
  options: {
    pathProp: keyof T;
    dims: ImageDimensions;
    fallback?: string;
    baseUrl?: string;
  }
): T & ImageTag {
  let {pathProp, fallback, baseUrl, dims} = options;
  baseUrl = baseUrl || `https://image.tmdb.org/t/p/w`;
  fallback = fallback || `assets/images/no_poster_available.jpg`;

  const res = _res as T & ImageTag;


  res.imgSizes = `(max-width: 500px) 154w,
               (max-width: 600px) 185w,
               (max-width: 1299px) 342w,
               (min-width: 1300px) 342w`;
  res.imgSrcset = "154w, 185w, 342w";
  res.imgSrc = res[pathProp]+'' || fallback;
  res.imgUrl = res[pathProp]
    ? `${baseUrl}${dims.WIDTH}/${res[pathProp]}`
    : fallback;
  res.imgWidth = dims.WIDTH;
  res.imgHeight = dims.HEIGHT;
  res.imgRatio = res.imgWidth / res.imgHeight;

  return res;
}
