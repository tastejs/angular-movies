import 'zone.js/dist/zone-node';
import '@angular/platform-server/init';

import {bootstrapApplication} from '@angular/platform-browser';
import {renderApplication} from '@angular/platform-server';

import {cloudlfareAppConfig} from './app/app.config.cloudflare';
import {AppStandaloneComponent} from './app/app.component.standlaone';
import {EdgeEnv, provideEdgeEnv} from './env.token';

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
(globalThis as any).__workerFetchHandler = async function fetch(
  request: Request,
  env: EdgeEnv
) {
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request).url;

  console.log(JSON.stringify(env, null, 2));

  const contentFromKV = await env.NGMOVIES.get(cacheKey, {
    type: 'text',
  });

  // Get the root `index.html` content.
  const indexUrl = new URL('/', url);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  // return directly from CF KV if given
  if (contentFromKV) {
    let response = new Response(contentFromKV, indexResponse);
    response.headers.append('Cache-Control', 's-maxage=200');
    return response;
  }

  const content = await renderApplication(
    () =>
      bootstrapApplication(
        AppStandaloneComponent,
        cloudlfareAppConfig([provideEdgeEnv({env, request})])
      ),
    { document, url: url.pathname }
  );

  await env.NGMOVIES.put(cacheKey, content, {
    // seconds
    expirationTtl: 1000,
  });

  let response = new Response(content, indexResponse);
  response.headers.append('Cache-Control', 's-maxage=200');
  return response;
};
