import fs from "node:fs";
import {setupArgv} from "./utils.mjs";
import {existsSync} from "fs";
import {resolvePath} from "./paths.mjs";

let target = resolvePath(setupArgv('target', {success: (name) => `Remove folder ${name}`}));

if (existsSync(target)) {
  try {
    fs.rmdirSync(target, {recursive: true});
  } catch (e) {
    console.log(e.message)
  }
}
