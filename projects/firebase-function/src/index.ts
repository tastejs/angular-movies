import * as functions from 'firebase-functions';

/* HACK START */
declare const __non_webpack_require__: NodeRequire;
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
const ssrApp = __non_webpack_require__('./main').app(); // NOTE: leave this as require() since this file is built dynamically by Angular Universal CLI webpack
/* HACK END */

// "ssr" is the name in firebase.function.json
export const ssr = functions
  .runWith({
    timeoutSeconds: 5,
    memory:
    // 4096MB memory function will run at currently fastest - 4.8 GHz CPU ( https://cloud.google.com/functions/pricing)
      '4GB'
  })
  .https.onRequest(ssrApp);


