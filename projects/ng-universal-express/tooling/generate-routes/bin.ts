import {getArgv} from "../utils";
import {run} from "./generate-routes.impl";

// collect params
const verbose = !getArgv('verbose');
const noMutation = !getArgv('no-mutation');
const targetFile = getArgv('target-file');
const sourceFile = getArgv('source-file');

// execute command
run({targetFile, sourceFile, verbose, noMutation});


