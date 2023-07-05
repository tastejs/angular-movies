// Copy the lazy loaded modules into the dist folder so that they can be
// uploaded along with the main Worker module.
import fs from "node:fs";
import path from "node:path";

function getArgv(propName) {
  return process.argv.find((i) => i.includes(`--${propName}`))?.split(/[=]/).pop() || '';
}

let worker = getArgv('worker');
let ssr = getArgv('ssr');

if (!ssr) {
  throw new Error('Param --ssr is required');
}

if (!worker) {
  throw new Error('Param --worker is required');
}
console.log(`Copy ${ssr} to ${worker} and rename main.js to index.js`);


fs.cpSync(ssr, worker, {recursive: true});
fs.renameSync(
  path.resolve(worker, "main.js"),
  path.resolve(worker, "index.js")
);
