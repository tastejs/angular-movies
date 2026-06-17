import {
  AngularAppEngine,
  createRequestHandler,
  ɵsetAngularAppEngineManifest,
} from '@angular/ssr';
import { KVNamespace } from '@cloudflare/workers-types';
import manifest from './angular-app-engine-manifest.mjs';
import { BUILD_ID } from './src/build-id';

// hack to make it work - not needed on normal angular setup
ɵsetAngularAppEngineManifest(manifest);

const angularApp = new AngularAppEngine({
  allowedHosts: ['*'],
  trustProxyHeaders: true,
});

export interface Env {
  ssr_cache: KVNamespace;
}

/** Cache each SSR-rendered page in Workers KV for 2 minutes. */
const SSR_CACHE_TTL_SECONDS = 120;

/** Stored alongside each cached page so a new deploy ignores stale entries. */
type CacheMetadata = { buildId: string };

export const reqHandlerFactory = (env: Env) =>
  createRequestHandler(async (req) => {
    const url = new URL(req.url);
    const cacheKey = `${url.pathname}${url.search}`;
    const isCacheable = req.method === 'GET';

    // 1. Serve from KV when we have a fresh, same-build entry.
    if (isCacheable) {
      try {
        const { value, metadata } =
          await env.ssr_cache.getWithMetadata<CacheMetadata>(cacheKey);
        if (value && metadata?.buildId === BUILD_ID) {
          return new Response(value, {
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': `s-maxage=${SSR_CACHE_TTL_SECONDS}`,
              'X-CF-Cache-Status': 'HIT',
              'X-Build-ID': BUILD_ID,
            },
          });
        }
      } catch (err) {
        // Fall through to rendering if KV is unavailable.
        console.error(`KV read error for "${cacheKey}":`, err);
      }
    }

    // 2. Render via Angular SSR.
    let res: Response | null;
    try {
      res = await angularApp.handle(req);
    } catch {
      return new Response('Page not found.', { status: 404 });
    }

    if (!res) {
      return new Response('Page render failed!', { status: 404 });
    }

    // 3. Only cache successful HTML GET responses.
    const contentType = res.headers.get('Content-Type') ?? '';
    if (
      isCacheable &&
      res.status === 200 &&
      contentType.includes('text/html')
    ) {
      const content = await res.clone().text();
      try {
        await env.ssr_cache.put(cacheKey, content, {
          expirationTtl: SSR_CACHE_TTL_SECONDS,
          metadata: { buildId: BUILD_ID } satisfies CacheMetadata,
        });
      } catch (err) {
        console.error(`KV write error for "${cacheKey}":`, err);
      }

      return new Response(content, {
        status: res.status,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': `s-maxage=${SSR_CACHE_TTL_SECONDS}`,
          'X-CF-Cache-Status': 'MISS',
          'X-Build-ID': BUILD_ID,
        },
      });
    }

    return res;
  });

export default {
  fetch: (req: Request, env: Env) => reqHandlerFactory(env)(req),
};
