// The Express app is exported so that it can be used by serverless Functions.
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { useCompression, useTiming } from './app/utils';
import { APP_BASE_HREF } from '@angular/common';
// bootstrap needs to get exported for the pre-render task

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  const distributionFolder = join(
    process.cwd(),
    'dist/projects/movies/browser',
  );

  const indexHtml = existsSync(join(distributionFolder, 'index.html'))
    ? 'index.html'
    : 'index';

  // use gzip
  useCompression(server);
  // use server-timing
  useTiming(server);

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  // server.engine('html', ngExpressEngine({ bootstrap }));

  server.set('view engine', 'html');
  server.set('views', distributionFolder);

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distributionFolder, {
      maxAge: '1y',
      // missing assets results in 404 instead of continuing to next route handler (and rendering route)
      fallthrough: false,
    }),
  );

  server.get(
    '*',
    // Version with server timings for SSR
    (request, response, _) => {
      console.log('req', request.url);
      // return rendered HTML including Angular generated DOM
      console.log('SSR for route', request.url);
      response.startTime('SSR', 'Total SSR Time');
      response.render(
        indexHtml,
        {
          req: request,
          providers: [{ provide: APP_BASE_HREF, useValue: request.baseUrl }],
        },
        (_, html) => {
          response.endTime('SSR');
          response.send(html);
        },
      );
    },
  );

  return server;
}

export { default } from './app/bootstrap';
