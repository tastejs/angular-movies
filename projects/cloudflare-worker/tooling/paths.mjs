import path from "node:path";
import {fileURLToPath} from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(dirname, "../../../");
export function resolvePath(pathToResolve) {
  return path.resolve(root, pathToResolve);
}
