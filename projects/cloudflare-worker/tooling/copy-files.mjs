// Copy the client-side files over so that they can be uploaded by the pages publish command.
import fs from "node:fs";
import {setupArgv} from "./utils.mjs";

let sourcePath = setupArgv('source');
let targetPath = setupArgv('target');

console.log(`Copy folder ${sourcePath} to ${targetPath}`);

fs.cpSync(sourcePath, targetPath, {recursive: true});
