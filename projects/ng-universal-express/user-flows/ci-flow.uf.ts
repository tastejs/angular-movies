import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';
import {ensureRenderType} from "../../movies/testing";

const flowOptions: UserFlowOptions = {
  name: 'Ng Universal Express - HTML is already rendered (SSR + Pre-render)',
};

// Verifies that the movies app is pre-rendered
const interactions: UserFlowInteractionsFn = async (
  context: UserFlowContext
): Promise<void> => {
  const {flow, collectOptions, page} = context;
  const url = `${collectOptions.url}/list/category/popular`;
  await page.setRequestInterception(true);

  /**
   * request interceptors to check content
   */
  let initialResponse: Promise<string>;
  // listen to the first match, then stop
  let indexHtmlArrived = false;
  page.on('request', request => request.continue());

  function responseHandler(response) {
    console.log('on', response.url());
    if (response.url() === url && !indexHtmlArrived) {
      indexHtmlArrived = true;
      initialResponse = response.text();
      console.log('hit', response.url());
      page.off('response', responseHandler);
    }
  };
  page.on('response', responseHandler);


  await flow.navigate(url, {
    stepName: '🧭 Initial navigation'
  });
  // TODO remove await
  const responseText = await initialResponse.then(v => v.toString());
  ensureRenderType(responseText, 'pre-rendered');

  return;
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

export default userFlowProvider;


