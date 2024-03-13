import {UserFlowContext, UserFlowInteractionsFn, UserFlowOptions, UserFlowProvider,} from '@push-based/user-flow';

import {mergeBudgets, MovieDetailPageUFO, MovieListPageUFO,} from '../../movies-user-flows/src';
import {getLhConfig} from "../../movies-user-flows/src/internals/test-sets";
import * as angularBudgets from "../testing/budgets/angular.budgets.json";
import * as generalTimingBudget from "../testing/budgets/general-timing.budgets.json";
import * as movieListBudgets from "../testing/budgets/movie-list.budgets.json";
import {PersonDetailPageUFO} from "../../movies-user-flows/src/ufo/desktop/person-detail-page.ufo";

const flowOptions: UserFlowOptions = {
  name: 'Person Detail Tests',
};

const interactions: UserFlowInteractionsFn = async (
  ctx: UserFlowContext
): Promise<any> => {
  const {flow, collectOptions, page} = ctx;
  const url = `${collectOptions.url}/list/category/popular`;
  const movieListPage = new MovieListPageUFO(ctx);
  const movieDetailPage = new MovieDetailPageUFO(ctx);
  const personDetailPage = new PersonDetailPageUFO(ctx);

  await flow.navigate(url, {
    stepName: '🧭 Initial navigation',
    config: getLhConfig(
      mergeBudgets([angularBudgets, generalTimingBudget, movieListBudgets])
    )
  });
  await flow.snapshot({
  stepName: '✔ Initial navigation done',
  });

let currentHeroImageSrc = undefined;

// ======= Detail navigations =======
await flow.startTimespan({
stepName: '🧭 Navigate to person detail',
});

try {
await movieListPage.navigateToDetail(1);
await movieDetailPage.awaitAllContent();
await movieDetailPage.goToPersonDetail(1);
await personDetailPage.awaitAllContent();
} catch (e) {
await flow.endTimespan();
return Promise.resolve();
}

currentHeroImageSrc = await personDetailPage.getHeroImageSrc();
await flow.endTimespan();
await flow.snapshot({
stepName: '✔ Navigation to detail page done',
});

// ======= Hero image change for cast =======

await flow.startTimespan({
stepName: '🧭 Navigate to movie detail',
});
try {
await personDetailPage.goToMovieDetail(1);
await movieDetailPage.awaitAllContent();

    const castImageSrc = await movieDetailPage.getHeroImageSrc();
    if (castImageSrc === currentHeroImageSrc) {
      throw new Error("Hero image does not change when navigating to cast!")
    }

} catch (e) {

    return Promise.resolve();

}

await flow.endTimespan();
await flow.snapshot({
stepName: '✔ Navigation to cast detail page done',
});

return Promise.resolve();
};

export const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
};

module.exports = userFlowProvider;
