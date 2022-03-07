import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@push-based/user-flow';
import { MovieDetailPageUFO } from '../ufo/desktop/movie-detail-page.ufo';

const flowOptions: UserFlowOptions = {
  name: 'Movie detail page to detail page navigations - Warm',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, collectOptions, page } = ctx;

  const testUrl = `${collectOptions.url}/detail/movie/634649`;
  const movieDetailPage = new MovieDetailPageUFO(ctx);

  await flow.navigate(testUrl, {
    stepName: 'Warmup',
  });
  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();

  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();

  await flow.startTimespan({
    stepName: 'Page Detail1.1 navigation',
  });
  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail2.1 navigation',
  });
  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail1.2 navigation',
  });
  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail2.2 navigation',
  });
  await movieDetailPage.goToMovieDetail(0);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
