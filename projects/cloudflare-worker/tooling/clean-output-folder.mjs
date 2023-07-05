import fs from "node:fs";


function getArgv(propName) {
  return process.argv.find((i) => i.includes(`--${propName}`))?.split(/[=]/).pop() || '';
}

let outputPath = getArgv('outputPath');

if (!outputPath) {
  throw new Error('Param --outputPath is required');
}
console.log(`Clean output folder ${outputPath}`);

try {
  fs.rmdirSync(outputPath, {recursive: true});
} catch (e) {
  console.log(e.message)
}
