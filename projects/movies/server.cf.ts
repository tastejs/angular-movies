import {
  AngularAppEngine,
  createRequestHandler,
  ɵsetAngularAppEngineManifest,
} from '@angular/ssr';
import manifest from './angular-app-engine-manifest.mjs';

// hack to make it work - not needed on normal angular setup
ɵsetAngularAppEngineManifest(manifest);

const angularApp = new AngularAppEngine({
  // It is safe to allow `localhost`, so that SSR can run in local development,
  // as, in production, Cloudflare will ensure that `localhost` is not the host.
  allowedHosts: ['*'],
  trustProxyHeaders: true,
});

export const reqHandler = createRequestHandler(async (req) => {
  try {
    const res = await angularApp.handle(req);
    if (!res) {
      return new Response('Page render failed!', { status: 404 });
    }
    return res;
  } catch {
    return new Response('Page not found.', { status: 404 });
  }
});

export default { fetch: reqHandler };
