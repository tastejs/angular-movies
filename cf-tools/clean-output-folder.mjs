import fs from "node:fs";
import {cloudflare} from "./paths.mjs";

try {
  fs.rmdirSync(cloudflare, {recursive: true});
} catch (e) {
  console.log(e.message)
}
