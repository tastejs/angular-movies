import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Cold Hot Category Navigations' };

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}list/category/popular`;
    const hamburgerBtn = '*[data-test="main-side-drawer-hamburger-button"]';
    const navLink1 = '*[data-test="sidebar-nav-link-category-popular"]';
    const navLink2 = '*[data-test="sidebar-nav-link-category-top_rated"]';
    const lcpListItem = '*[data-test="list-item-idx-1"]';

    await flow.navigate(testUrl, {
      stepName: 'Page Category-Popular navigation',
    });
    await page.waitForSelector(lcpListItem);
    await flow.startTimespan({
      stepName: 'Page Category-Popular top-rated navigation',
    });
    await page.waitForSelector(hamburgerBtn);
    await page.click(hamburgerBtn);
    await page.waitForSelector(navLink2);
    await page.click(navLink2);
    await page.waitForSelector(lcpListItem);
    await flow.endTimespan();
    await flow.startTimespan({
      stepName: 'Page Category-Popular popular navigation',
    });
    await page.click(hamburgerBtn);
    await page.waitForSelector(navLink1);
    await page.click(navLink1);
    await page.waitForSelector(lcpListItem);
    await flow.endTimespan();
    await flow.startTimespan({
      stepName: 'Page Category-Popular top-rated navigation',
    });
    await page.waitForSelector(hamburgerBtn);
    await page.click(hamburgerBtn);
    await page.waitForSelector(navLink2);
    await page.click(navLink2);
    await page.waitForSelector(lcpListItem);
    await flow.endTimespan();
    return Promise.resolve();
  };
}

export const report = async (cfg: any) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
