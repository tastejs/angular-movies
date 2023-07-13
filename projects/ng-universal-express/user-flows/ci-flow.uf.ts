import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';
import {MovieListPageUFO} from '../../movies-user-flows/src';

const flowOptions: UserFlowOptions = {
  name: 'Ng Universal Pre-rendering',
};

// Verifies that the movies app is pre-rendered
const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<void> => {
  const {flow, collectOptions, page} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const movieListPage = new MovieListPageUFO(ctx);

  await page.setRequestInterception(true);

  page.on('request', req => req.continue());

  let initialResponse: Promise<string>;
  page.on('response', response => {
    if (response.url() === url) {
      initialResponse = response.text();
    }
  });

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation'
  });
  const responseText = await initialResponse;

  if (responseText.includes('loading-csr')) {
    throw new Error('Loading Spinner is present in initial navigation');
  }
  if (!responseText.includes('data-uf="movie-0"')) {
    throw new Error('Movie is not present in initial navigation');
  }

  await movieListPage.awaitHeadingContent();

  return Promise.resolve();
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
