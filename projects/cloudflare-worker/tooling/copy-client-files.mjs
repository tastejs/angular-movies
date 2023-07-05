// Copy the client-side files over so that they can be uploaded by the pages publish command.
import fs from "node:fs";

function getArgv(propName) {
  return process.argv.find((i) => i.includes(`--${propName}`))?.split(/[=]/).pop() || '';
}

let sourcePath = getArgv('source');
let outputPath = getArgv('outputPath');

if (!sourcePath) {
  throw new Error('Param --sourcePath is required');
}

if (!outputPath) {
  throw new Error('Param --outputPath is required');
}
console.log(`Copy folder ${sourcePath} to ${outputPath}`);

fs.cpSync(sourcePath, outputPath, {recursive: true});
