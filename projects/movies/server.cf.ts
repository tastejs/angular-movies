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
  allowedHosts: ['localhost'],
});

export const reqHandler = createRequestHandler(async (req) => {
  const res = await angularApp.handle(req);

  return res ?? new Response('Page not found.', { status: 404 });
});

export default { fetch: reqHandler };
