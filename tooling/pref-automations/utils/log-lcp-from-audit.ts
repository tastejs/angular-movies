import * as fs from 'fs';
import domino from 'domino';

export function optimizeHtmlFileForLCP(
  targetPath: string,
  reportPath: string,
  options?: { fetchpriorityFallback: boolean }
) {
  let reportJson = JSON.parse(
    fs.readFileSync(reportPath, { encoding: 'utf8' })
  );
  // determine LCP element from audit
  const lcpCandidate = detectLCPElement(reportJson);
  if (lcpCandidate === false) {
    console.log('No candidate of type img available');
  } else {
    const { url, element } = lcpCandidate;
    const originalHtml = fs.readFileSync(targetPath, { encoding: 'utf8' });
    const opt = {
      preloadUrl: options?.fetchpriorityFallback ? url : null,
    };
    const optimizedHtml = optimizeLCPElement(originalHtml, element || '', opt);
    console.log('update target with optimizations');
    fs.writeFileSync(targetPath, optimizedHtml);
  }
}

function getDocumentFromHtml(htmlString: string): Document {
  let window = domino.createWindow(htmlString);
  let document = window.document;
  return document;
}

function detectLCPElement(
  reportJson: Record<string, any>
): { url: string; element: string } | false {
  if (!reportJson.steps[0].lhr.audits['lcp-lazy-loaded']) {
    throw new Error(`LCP audit is not in result.`);
  }
  if (
    !reportJson.steps[0].lhr.audits['lcp-lazy-loaded']?.details?.items?.length
  ) {
    console.log(`LCP audit does not contain candidates`);
    return false;
  }
  const lcpAuditDetails =
    reportJson.steps[0].lhr.audits['lcp-lazy-loaded'].details;

  const DomSnippet = lcpAuditDetails.items[0].node.snippet;
  const srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;
  const res = srcChecker.exec(DomSnippet);
  const url = res && res[2];
  const element = res && res.input;

  return url && element
    ? {
        url,
        element,
      }
    : false;
}

function optimizeLCPElement(
  html: string,
  elemToOptimize: string,
  options: { preloadUrl: string | null | undefined }
): string {
  const doc: Document = getDocumentFromHtml(elemToOptimize);
  // @ts-ignore
  const img = doc.body.querySelector('img');
  img.removeAttribute('loading');
  img.setAttribute('fetchpriority', 'high');
  // @ts-ignore
  const _ = doc.createElement('div');
  _.appendChild(img);
  const optimizedElem = _.innerHTML;
  if (html.match(elemToOptimize)) {
    console.log('LCP element not present in target html');
  }
  const optimizedHtml = html.replace(elemToOptimize, optimizedElem);
  console.log('LCP element optimized.');
  if (options.preloadUrl) {
    throw new Error('Adding a preload link to head is not implemented.');
    //const preloadLink = `<link rel="preload" as="image" src="${options.preloadUrl}" />`;
    //console.log('preloadLink: ', preloadLink);
  }
  return optimizedHtml;
}
