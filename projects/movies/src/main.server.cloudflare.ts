import 'zone.js/dist/zone-node';
import '@angular/platform-server/init';

import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';

import { cloudlfareAppConfig } from './app/app.config.cloudflare';
import { AppServerComponent } from './app/app.component.server';
import { provideEdgeEnv, EdgeEnv } from './env.token';

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
(globalThis as any).__workerFetchHandler = async function fetch(
  request: Request,
  env: EdgeEnv,
  ctx: any
) {
  const cacheUrl = new URL(request.url);
  // Construct the cache key from the cache URL
  const cacheKey = new Request(cacheUrl.toString(), request);
  // @ts-ignore
  const cache = caches.default;
  // Check whether the value is already available in the cache
  // if not, you will need to fetch it from origin, and store it in the cache
  let response = await cache.match(cacheKey);
  if (response) {
    console.log(`Cache hit for: ${request.url}.`);
    return response;
  }

  const url = new URL(request.url);

  // Get the root `index.html` content.
  const indexUrl = new URL('/', url);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  const content = await renderApplication(
    () =>
      bootstrapApplication(
        AppServerComponent,
        cloudlfareAppConfig([provideEdgeEnv({ env, request })])
      ),
    { document, url: url.pathname }
  );

  response = new Response(content, indexResponse);

  // Cache API respects Cache-Control headers. Setting s-max-age to 10
  // will limit the response to be in cache for 10 seconds max
  // Any changes made to the response here will be reflected in the cached value
  response.headers.append('Cache-Control', 's-maxage=100');

  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  // console.log("rendered SSR", content);
  return response;
};
