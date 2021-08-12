import * as functions from 'firebase-functions';

// NOTE: leave this as require() since this file is built dynamically by Angular CLI webpack
// tslint:disable-next-line:no-require-imports no-var-requires
const ssrApp = require('./main').app();

export const ssr = functions
  .runWith({ timeoutSeconds: 10, memory: '2GB' })
  .https.onRequest(ssrApp);
