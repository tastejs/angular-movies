import '@angular/platform-server/init';

import { renderApplication } from '@angular/platform-server';
import {
  EdgeEnvironment,
  provideEdgeEnvironment,
} from './app/environment.token';
import bootstrap from './app/bootstrap';

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
(globalThis as any).__workerFetchHandler = async function fetch(
  request: Request,
  environment: EdgeEnvironment,
) {
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request).url;

  console.log(JSON.stringify(environment, undefined, 2));

  const contentFromKV = await environment.NGMOVIES.get(cacheKey, {
    type: 'text',
  });

  // Get the root `index.html` content.
  const indexUrl = new URL('/', url);
  const indexResponse = await environment.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  // return directly from CF KV if given
  if (contentFromKV) {
    let response = new Response(contentFromKV, indexResponse);
    response.headers.append('Cache-Control', 's-maxage=200');
    return response;
  }

  const content = await renderApplication(
    () =>
      bootstrap({
        providers: [provideEdgeEnvironment({ request, env: environment })],
      }),
    { document, url: url.pathname },
  );

  await environment.NGMOVIES.put(cacheKey, content, {
    // seconds
    expirationTtl: 1000,
  });

  let response = new Response(content, indexResponse);
  response.headers.append('Cache-Control', 's-maxage=200');
  return response;
};
