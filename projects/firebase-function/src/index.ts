import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';

/*
  Import hack start

  To keep the builds of functions and angular app separated we have to import the SSR app dynamically.
  In CJS ecosystem we'd simply use require (or webpack require hack), but since this is future, and we use ESM now,
  we need to use dynamic import handled by try/catch, silence the error of non-existing import path and mark
  the "server" as external dependency in functions ESBuild config in project.json + tsconfig.functions.ts

  Also we go for an export default as we don't want to just relly on naming of the function that anyone could potentially change.
*/
let ssrApp: (request: Request, response: Response) => void | Promise<void>;
try {
  /* @ts-expect-error */
  // eslint-disable-next-line unicorn/no-await-expression-member
  ssrApp = (await import('./server.mjs')).default(); // NOTE: leave this as dynamic import since this file is built dynamically by Angular app build step
} catch (error) {
  ssrApp = () => console.error('Error importing pre-build server app.\n');
  console.error('Could not import pre-build server app.\n', error);
}
/* Import hack end */

export const ssr = onRequest(
  {
    timeoutSeconds: 5,
    memory:
      '4GiB' /* 4GiB memory function will run at currently fastest at cheapest price - 4.8 GHz CPU ( https://cloud.google.com/functions/pricing) */,
  },
  ssrApp
);
