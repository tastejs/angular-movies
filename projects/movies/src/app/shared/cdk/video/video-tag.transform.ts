import { VideoTag } from './video.interface';

export function addVideoTag<T extends Object>(_res: T, options: { pathPropFn: (o: T) => string, baseUrl?: string }): T & VideoTag {
  let { pathPropFn, baseUrl } = options;
  baseUrl = baseUrl || 'https://www.youtube.com/embed';

  const res = _res as T & VideoTag;
  const path = pathPropFn(res);
  res.videoUrl = path ? `${baseUrl}/${path}` : false;

  return res;
}
