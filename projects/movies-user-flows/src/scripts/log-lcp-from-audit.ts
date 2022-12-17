// import * as fs from 'fs';
console.log('run LCP experiment');
/*(() => {
  const { collect, persist } = JSON.parse(
    fs.readFileSync('./user-flowrc.lcp.json', 'uft8') || '{}'
  );
  const { outPath } = persist;

  const f = fs.readdirSync(outPath).find((n) => n.includes('lcp'));

  if (f) {
    let reportJson = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log(reportJson);
  }
})();
*/
