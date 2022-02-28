import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';
import { MovieDetailPagePageObject } from './po/desktop/movie-detail-page.po';
import { MovieListPagePageObject } from './po/desktop/movie-list-page.po';
import { SidebarPageObject } from './po/mobile/side-bar.po';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Category - Detail Navigation' };

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}list/category/popular`;
    const sidebar = new SidebarPageObject(page);
    const movieListPage = new MovieListPagePageObject(page);
    const topRatedName = 'topRated';
    const movieDetailPage = new MovieDetailPagePageObject(page);

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
