import * as functions from 'firebase-functions';

/* Hack start */
declare const __non_webpack_require__: NodeRequire;
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'

// tslint:disable-next-line:no-require-imports no-var-requires
// eslint-disable-next-line unicorn/prefer-module
const ssrApp = __non_webpack_require__('./main').app(); // NOTE: leave this as require() since this file is built dynamically by Angular CLI webpack
/* Hack end */

export const ssr = functions
  .runWith({
    timeoutSeconds: 5,
    memory:
      '4GB' /* 4096MB memory function will run at currently fastest - 4.8 GHz CPU ( https://cloud.google.com/functions/pricing) */,
  })
  .https.onRequest(ssrApp);


