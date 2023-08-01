import {appPlaceholderId} from './general';
import {movieImgAttr} from './ui-movie-list';

export const isCsr = (indexHtmlContent: string): boolean => {
  return indexHtmlContent.includes(appPlaceholderId);
};
export const isPreRendered = (indexHtmlContent: string): boolean => {
  return indexHtmlContent.includes(movieImgAttr(0));
};

export function ensureRenderType(
  html: string,
  mode: 'csr' | 'pre-rendered' = 'csr'
): void {
  const isHtmlCsr = isCsr(html);
  if (mode === 'csr' && !isHtmlCsr) {
    throw new Error(
      `Indicator for client side rendering is ${
        isHtmlCsr ? '' : 'NOT'
      } present in index HTML.`
    );
  }

  const isHtmlSsr = isPreRendered(html);
  if (mode === 'pre-rendered' && !isHtmlSsr) {
    throw new Error(
      `Loading Spinner is ${
        isHtmlSsr ? '' : 'NOT'
      } present in initial navigation`
    );
  }
}
