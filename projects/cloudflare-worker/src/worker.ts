import 'zone.js';
import 'zone.js/node';
import '@angular/platform-server/init';

import { renderApplication } from '@angular/platform-server';
import {
  EdgeEnvironment,
  provideEdgeEnvironment,
} from './app/environment.token';
import bootstrap from './app/bootstrap';

// Attach the Cloudflare `fetch()` handler to the global scope so that it can
// be exported when we post-process the Angular build output. See tooling/bundle.mjs
(globalThis as any).__workerFetchHandler = async function fetch(
  request: Request,
  environment: EdgeEnvironment
) {
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request).url;

  console.log(JSON.stringify(environment, undefined, 2));

  const contentFromKV = await environment.NGMOVIES.get(cacheKey, {
    type: 'text',
  });

  const indexUrl = new URL('/', url);
  const indexResponse = await environment.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  if (contentFromKV) {
    const response = new Response(contentFromKV, indexResponse);
    response.headers.append('Cache-Control', 's-maxage=200');
    return response;
  }

  const content = await renderApplication(
    (context) =>
      bootstrap(context, {
        providers: [provideEdgeEnvironment({ request, env: environment })],
      }),
    { document, url: url.pathname }
  );

  await environment.NGMOVIES.put(cacheKey, content, {
    expirationTtl: 1000,
  });

  const response = new Response(content, indexResponse);
  response.headers.append('Cache-Control', 's-maxage=200');
  return response;
};
