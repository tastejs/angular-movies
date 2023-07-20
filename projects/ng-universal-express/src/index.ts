import 'zone.js';
import 'zone.js/dist/zone-node';
// The Express app is exported so that it can be used by serverless Functions.
import express from 'express';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {ISRHandler} from 'ngx-isr';
import {environment} from '../../movies/src/environments/environment';
import {ngExpressEngine} from '@nguniversal/express-engine';
import bootstrap from './app/bootstrap';
import {useCompression, useTiming} from './app/utils';
// bootstrap needs to get exported for the pre-render task

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  // cwd is wherever the closest package.json is. for firebase function deploy and emulators
  const distributionFolder = join(
    process.cwd(),
    'dist/projects/movies/browser'
  );

  const indexHtml = existsSync(join(distributionFolder, 'index.html'))
    ? 'index.html'
    : 'index';

  // @ts-ignore
  const isr = new ISRHandler({
    indexHtml,
    invalidateSecretToken: 'MY_TOKEN',
    enableLogging: !environment.production,
  });

  // use gzip
  useCompression(server);
  // use server-timing
  useTiming(server);

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({bootstrap}));

  server.set('view engine', 'html');
  server.set('views', distributionFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distributionFolder, {
      maxAge: '1y',

      // missing assets results in 404 instead of continuing to next route handler (and rendering route)
      fallthrough: false,
    })
  );

  server.get(
    '*',
    /*
    // Version with server timings for SSR
    (req, res) => {
      // return rendered HTML including Angular generated DOM
      console.log('SSR for route', req.url);
      res.startTime('SSR', 'Total SSR Time');
      res.render(
        indexHtml,
        {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}],},
        (_, html) => {
          res.endTime('SSR')
          res.send(html);
        }
      );
    },*/
    // Serve page if it exists in cache
    async (request, response, next) => {
      return await isr.serveFromCache(request, response, next);
    },
    // Server side render the page and add to cache if needed
    async (request, response, next) => {
      return await isr.render(request, response, next);
    }
  );

  return server;
}

export {default} from './app/bootstrap';
