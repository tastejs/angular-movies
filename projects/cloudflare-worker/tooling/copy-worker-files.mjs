// Copy the lazy loaded modules into the dist folder so that they can be
// uploaded along with the main Worker module.
import fs from "node:fs";
import path from "node:path";
import {resolvePath} from "./paths.mjs";
import {setupArgv} from "./utils.mjs";

let ssr = resolvePath(setupArgv('ssr'));
let worker = resolvePath(setupArgv('worker'));

console.log(`Copy ${ssr} to ${worker} and rename main.js to index.js`);


fs.cpSync(ssr, worker, {recursive: true});
fs.renameSync(
  path.resolve(worker, "main.js"),
  path.resolve(worker, "index.js")
);
