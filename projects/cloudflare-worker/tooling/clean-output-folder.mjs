import fs from "node:fs";
import {setupArgv} from "./utils.mjs";
import {existsSync} from "fs";

let target = setupArgv('target', {success: () => `Remove folder ${target}`});

if (existsSync(target)) {
  try {
    fs.rmdirSync(target, {recursive: true});
  } catch (e) {
    console.log(e.message)
  }
}
