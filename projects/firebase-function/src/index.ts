import * as functions from 'firebase-functions';

// NOTE: leave this as require() since this file is built dynamically by Angular CLI webpack
// tslint:disable-next-line:no-require-imports no-var-requires
const ssrApp = require('./main').app();

export const ssr = functions
  .runWith({
    timeoutSeconds: 5,
    memory:
      '4GB' /* 4096MB memory function will run at currently fastest - 4.8 GHz CPU ( https://cloud.google.com/functions/pricing) */,
  })
  .https.onRequest(ssrApp);
