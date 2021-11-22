import { captureReport, FlowActions, FlowOptions, PPTOptions } from './utils';
import { parseTitle } from '../../projects/movies/src/app/shared/utils/parse-movie-list-title';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Category Navigations' };


function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}list/category/popular`;
    const listHeader = '*[data-test="header-list"]';
    const hamburgerBtn = '*[data-test="main-side-drawer-hamburger-button"]';
    const navLink = '*[data-test="sidebar-nav-link-category-top_rated"]';
    const listContent = '*[data-test="list-container"]';
    const lcpListItem = '*[data-test="list-item-idx-1"]';
    const lcpDetailItem = '*[data-test="detail-item-img"]';
    const listLoader = '*[data-test="list-loader"]';
    const listEmpty = '*[data-test="list-empty"]';

    await flow.navigate(testUrl, {
      stepName: 'Page Category-Popular navigation'
    });
    await flow.startTimespan({ stepName: 'Page Category-Popular movies loaded' });

    // Wait for subtitle changed text, then take snapshot.
    /* await page.waitForFunction(
      (selector) => document.querySelector(selector).innerText.toLowerCase().includes("popular"),
      {},
      listHeader
    ); */

    // Wait for first demo-image button, then open it.
    await page.waitForSelector(hamburgerBtn);
    // await flow.snapshot({ stepName: 'Page Category-Popular sidebar loaded' });

    await page.click(hamburgerBtn);
    await page.waitForSelector(navLink);
    // await flow.snapshot({ stepName: 'Page Category-Popular sidebar open' });

    await page.click(navLink);
    // Wait for subtitle changed text, then take snapshot.
   /* await page.waitForFunction(

      (selector) => document.querySelector(selector).innerText.toLowerCase().includes("top rated"),
      {},
      listHeader
    );*/

    await page.waitForSelector(lcpListItem);
    await flow.endTimespan();
    await flow.startTimespan({ stepName: 'Page Category-Popular detail navigation' });
    await page.click(lcpListItem);
    await page.waitForSelector(lcpDetailItem);

    await flow.endTimespan();
    return Promise.resolve();
  };
}

export const report = async (cfg: any) => await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));

