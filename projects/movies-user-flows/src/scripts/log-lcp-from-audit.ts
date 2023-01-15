import * as fs from 'fs';
import * as path from 'path';
import domino from 'domino';

console.log('run LCP experiment');
(() => {
  const reportPath = './projects/movies-user-flows/.user-flowrc.lcp.json';
  const target = './projects/movies-user-flows/src/scripts/example.html';
  optimizeHtmlFileForLCP(target, reportPath);
})();

function optimizeHtmlFileForLCP(
  targetPath: string,
  reportPath: string,
  options?: { fetchpriorityFallback: boolean }
) {
  const { collect, persist } = JSON.parse(
    fs.readFileSync(reportPath, { encoding: 'utf8', }) || '{}'
  );
  const { outPath } = persist;
  const f = fs.readdirSync(outPath).find((n) => n.includes('lcp'));

  if (f) {
    let reportJson = JSON.parse(
      fs.readFileSync(path.join(outPath, f), { encoding: 'utf8' })
    );
    const DomSnippet =
      reportJson.steps[0].lhr.audits['lcp-lazy-loaded'].details.items[0].node.snippet;
    const srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;
    const res = srcChecker.exec(DomSnippet);
    const url = res && res[2];
    const elem = res && res.input;
    console.log('LCP elem', elem);
    console.log('LCP elem url', url);
    const originalHtml = fs.readFileSync(targetPath, { encoding: 'utf8' });
    const optimizedHtml = optimizeLCPElement(originalHtml, elem || '', {
      preloadUrl: options?.fetchpriorityFallback ? url : null,
    });
    fs.writeFileSync(targetPath, optimizedHtml);
  }
}

function getDocumentFromHtml(htmlString: string): Document {
  let window = domino.createWindow(htmlString);
  let document = window.document;
  return document;
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
  const optimizedHtml = html.replace(elemToOptimize, optimizedElem);

  if (options.preloadUrl) {
    throw new Error('Adding a preload link to head is not implemented.');
    const preloadLink = `<link rel="preload" as="image" src="${options.preloadUrl}" />`;
    console.log('preloadLink: ', preloadLink);
  }
  return optimizedHtml;
}
