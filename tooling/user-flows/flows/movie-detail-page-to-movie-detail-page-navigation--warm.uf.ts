import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';
import { MovieDetailPageUFO } from './po/desktop/movie-detail-page.ufo';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = {
  name: 'Detail to Detail Navigations - Warm',
};

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}detail/movie/634649`;
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
}

export const report = async (cfg: any) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
