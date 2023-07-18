import {LinkTag} from './a-tag.interface';

export function addLinkTag<T>(
  _res: T,
  prop: keyof T,
  options: {
    target?: string;
    baseUrl?: string;
  } = {}
): T & LinkTag {
  let {target, baseUrl} = options;
  target = target || `_blank`;
  baseUrl = baseUrl || `https://www.imdb.com/title/`;

  const res = _res as T & LinkTag;
  res.href = baseUrl + _res[prop];
  res.target = target;

  return res;
}
