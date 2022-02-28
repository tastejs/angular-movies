import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';
import { MovieDetailPageUFO } from './po/desktop/movie-detail-page.ufo';
import { MovieListPageUFO } from './po/desktop/movie-list-page.ufo';
import { SidebarUFO } from './po/mobile/side-bar.ufo';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}list/category/popular`;
    const sidebar = new SidebarUFO(page);
    const movieListPage = new MovieListPageUFO(page);
    const topRatedName = 'topRated';
    const movieDetailPage = new MovieDetailPageUFO(page);

    await flow.navigate(testUrl, {
      stepName: 'Page Category-Popular navigation',
    });
    await flow.startTimespan({
      stepName: 'Page Category-Popular movies loaded',
    });
    await sidebar.clickSideMenuBtn();
    await sidebar.navigateToCategory(topRatedName);
    await movieListPage.awaitLCPContent();
    await flow.endTimespan();

    await flow.startTimespan({
      stepName: 'Page Category-Popular detail navigation',
    });
    await movieListPage.movieList.clickMovieListImage(1);
    await movieDetailPage.awaitAllContent();
    await flow.endTimespan();

    return Promise.resolve();
  };
}

export const report = async (cfg: any) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
