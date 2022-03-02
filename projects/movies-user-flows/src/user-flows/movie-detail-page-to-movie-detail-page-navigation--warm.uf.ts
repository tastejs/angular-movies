import {
  UserFlowProvider,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
} from '@user-flow/cli';
import { MovieDetailPageUFO } from '../ufo/desktop/movie-detail-page.ufo';

const flowOptions: UserFlowOptions = {
  name: 'Detail to Detail Navigations - Warm',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const { flow, baseUrl, page } = ctx;

  const testUrl = `${baseUrl}detail/movie/634649`;
  const movieDetailPage = new MovieDetailPageUFO(page);

  await flow.navigate(testUrl, {
    stepName: 'Warmup',
  });
  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();

  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();

  await flow.startTimespan({
    stepName: 'Page Detail1.1 navigation',
  });
  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail2.1 navigation',
  });
  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail1.2 navigation',
  });
  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  await flow.startTimespan({
    stepName: 'Page Detail2.2 navigation',
  });
  await movieDetailPage.goToMovieDetail(1);
  await movieDetailPage.awaitAllContent();
  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
