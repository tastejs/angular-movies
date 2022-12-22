import * as fs from 'fs';
import * as path from 'path';
console.log('run LCP experiment');
(() => {
  const { collect, persist } = JSON.parse(
    fs.readFileSync('./projects/movies-user-flows/.user-flowrc.lcp.json', {
      encoding: 'utf8',
    }) || '{}'
  );
  const { outPath } = persist;

  const f = fs.readdirSync(outPath).find((n) => n.includes('lcp'));

  if (f) {
    let reportJson = JSON.parse(
      fs.readFileSync(path.join(outPath, f), { encoding: 'utf8' })
    );
    const DomSnippet =
      reportJson.steps[0].lhr.audits['lcp-lazy-loaded'].details.items[0].node
        .snippet;
    const srcChecker = /(src=["'])([A-Za-z0-9$.:/_\-~]*)(["'])(?!data:$)/g;
    const res = srcChecker.exec(DomSnippet);
    const url = res && res[2];
    console.log('LCP elem url', url);
    const preloadLink = `<link rel="preload" as="image" src="${url}" />`;
    console.log('preloadLink: ', preloadLink);
  }
})();
