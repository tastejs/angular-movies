import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let gitHash = 'dev';
try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch {
  // not a git repo or git not available
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const readable = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
  now.getDate()
)}-${pad(now.getHours())}${pad(now.getMinutes())}`;
const buildId = `${gitHash}-${readable}`;

const output = `// Auto-generated at build time — do not edit
export const BUILD_ID = '${buildId}';
`;

writeFileSync(
  join(__dirname, '../projects/movies/src/build-id.ts'),
  output,
  'utf8'
);
console.log(`[generate-build-id] BUILD_ID = ${buildId}`);
