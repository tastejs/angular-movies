import fs from "node:fs";
import {cloudflare} from "./paths.mjs";

fs.rmdirSync(cloudflare, {recursive: true});
