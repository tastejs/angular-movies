// Copy the client-side files over so that they can be uploaded by the pages publish command.
import fs from 'node:fs';
import {setupArgv} from './utils.mjs';
import {resolvePath} from './paths.mjs';

let sourcePath = resolvePath(setupArgv('source'));
let targetPath = resolvePath(setupArgv('target'));

console.log(`Copy folder ${sourcePath} to ${targetPath}`);

fs.cpSync(sourcePath, targetPath, {recursive: true});
