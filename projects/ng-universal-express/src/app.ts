import 'zone.js/dist/zone-node';

// The Express app is exported so that it can be used by serverless Functions.
import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { ISRHandler } from 'ngx-isr';
import { environment } from '../../movies/src/environments/environment';
import compressionModule from 'compression';
import { ngExpressEngine } from '@nguniversal/express-engine';
import bootstrap from '../../movies/src/main.server';

export function app(): express.Express {
  const server = express();

  const distFolder = join(process.cwd(), 'dist/projects/movies/browser');

  const indexHtml = existsSync(join(distFolder, 'index.html'))
    ? 'index.html'
    : 'index';

  const isr = new ISRHandler({
    indexHtml,
    invalidateSecretToken: 'MY_TOKEN',
    enableLogging: !environment.production,
  });

  // patchWindow(indexHtml);

  // **🚀 Perf Tip:**
  // Serve gzip for faster load
  server.use(compressionModule());

  // server.use(serverTiming());

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({ bootstrap, inlineCriticalCss: false })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',

      // missing assets results in 404 instead of continuing to next route handler (and rendering route)
      fallthrough: false,
    })
  );

  server.get(
    '*',
    // Serve page if it exists in cache
    async (req, res, next) => await isr.serveFromCache(req, res, next),
    // Server side render the page and add to cache if needed
    async (req, res, next) => await isr.render(req, res, next)
  );

  return server;
}
