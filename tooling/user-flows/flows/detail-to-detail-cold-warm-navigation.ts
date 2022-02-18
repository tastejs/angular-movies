import { captureReport, FlowActions, FlowOptions, PPTOptions } from '../utils';

const pptOptions: PPTOptions = { headless: false };
const flowOptions: FlowOptions = { name: 'Cold Hot Detail Navigations' };

function setupFlowActions(cfg: { baseUrl: string }): FlowActions {
  return async (flow: any, page: any): Promise<void> => {
    const testUrl = `${cfg.baseUrl}detail/movie/634649`;
    const lcpItem = '*[data-test="detail-item-img"]';
    const lcpListItem = '*[data-test="list-item-idx-1"]';

    await flow.navigate(testUrl, {
      stepName: 'Page Detail1.1 navigation',
    });
    await page.waitForSelector(lcpListItem);
    await flow.startTimespan({
      stepName: 'Page Detail2.1 navigation',
    });
    await page.click(lcpListItem);
    await page.waitForSelector(lcpListItem);
    await page.waitForSelector(lcpItem);
    await flow.endTimespan();

    await flow.startTimespan({
      stepName: 'Page Detail1.2 navigation',
    });
    await page.click(lcpListItem);
    await page.waitForSelector(lcpListItem);
    await page.waitForSelector(lcpItem);
    await flow.endTimespan();

    await flow.startTimespan({
      stepName: 'Page Detail2.2 navigation',
    });
    await page.click(lcpListItem);
    await page.waitForSelector(lcpListItem);
    await page.waitForSelector(lcpItem);
    await flow.endTimespan();
    return Promise.resolve();
  };
}

export const report = async (cfg: any) =>
  await captureReport(pptOptions, flowOptions, await setupFlowActions(cfg));
