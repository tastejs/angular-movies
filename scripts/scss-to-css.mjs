import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = join(repoRoot, 'projects/movies/src');
const loadPath = srcRoot;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.scss')) files.push(p);
  }
  return files;
}

function compileScss(scssPath) {
  const cssPath = scssPath.replace(/\.scss$/, '.css');
  mkdirSync(dirname(cssPath), { recursive: true });
  execSync(
    `npx sass "${scssPath}" "${cssPath}" --load-path="${loadPath}" --style=expanded --no-source-map`,
    { cwd: repoRoot, stdio: 'pipe' }
  );
}

// Remove existing css files first
function walkCss(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkCss(p);
    else if (p.endsWith('.css')) unlinkSync(p);
  }
}
walkCss(srcRoot);

const scssFiles = walk(srcRoot);
for (const scss of scssFiles) {
  compileScss(scss);
  unlinkSync(scss);
}

// Remove empty mixins directory if exists
try {
  const mixinsDir = join(srcRoot, 'app/ui/token/mixins');
  readdirSync(mixinsDir).forEach((f) => unlinkSync(join(mixinsDir, f)));
} catch {
  /* already gone */
}

console.log(`Compiled ${scssFiles.length} scss files to css`);
