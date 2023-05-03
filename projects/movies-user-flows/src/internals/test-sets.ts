import { UserFlowOptions } from '@push-based/user-flow';
import { readFileSync } from 'fs';
import Budget from 'lighthouse/types/lhr/budget';
import { readBudgets } from '@push-based/user-flow/src/lib/commands/assert/utils/budgets';

type Test = {
  name: string;
  urls: string[];
  ufs: string[];
  lhBudget: string[];
};

export function getTestSets(
  path: string,
  options: {
    baseUrl: string;
    match: string;
  }
): {
  url: string;
  cfg: {
    config: any;
  };
}[] {
  const testSet: Test[] = JSON.parse(readFileSync(path).toString()) as Test[];

  return testSet
    .filter((test) => test.ufs.find((u) => u.includes(options.match)))
    .flatMap((test: Test) => {
      const cfg: any = {
        stepName: test.name,
      };
      if (test.lhBudget && test.lhBudget.length) {
        // cache by filename?
        cfg.config = {
          extends: 'lighthouse:default',
          settings: {
            budgets: mergeBudgets(test.lhBudget),
          },
        };
      }

      return test.urls.map((url) => ({
        url: options.baseUrl ? options.baseUrl + url : url,
        cfg,
      }));
    });
}

export function mergeBudgets(lhBudgetPaths: string[]): Budget[] {
  return [
    lhBudgetPaths
      // map path to json ( string => Budget[] )
      .flatMap((budgetPath) => readBudgets(budgetPath))
      .reduce(
        (mergedBudget, budget: Budget) => {
          // @ts-ignore
          budget.resourceCounts &&
            (mergedBudget.resourceCounts = [
              ...mergedBudget.resourceCounts,
              ...budget.resourceCounts,
            ]);
          budget.resourceSizes &&
            (mergedBudget.resourceSizes = [
              ...mergedBudget.resourceSizes,
              ...budget.resourceSizes,
            ]);
          // @ts-ignore
          budget.timings &&
            (mergedBudget.timings = [
              ...mergedBudget.timings,
              ...budget.timings,
            ]);
          return mergedBudget;
        },
        {
          resourceCounts: [],
          resourceSizes: [],
          timings: [],
        } as Budget
      ),
  ];
}
