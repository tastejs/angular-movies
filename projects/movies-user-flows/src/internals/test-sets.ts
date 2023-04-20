import {UserFlowOptions} from "@push-based/user-flow";
import {readFileSync} from "fs";
import Budget from "lighthouse/types/lhr/budget";
import {readBudgets} from "@push-based/user-flow/src/lib/commands/assert/utils/budgets";

type Test = {
  "name": string,
  "urls": string[],
  "ufs": string[],
  "lhBudget": string[]
}

export function getTestSets(path: string, options: {
  baseUrl: string,
  match: string
}): {
  url: string, cfg: {
    config: any
  }
}[] {
  const testSet: Test[] = JSON.parse(readFileSync(path).toString()) as Test[];


  return testSet
    .filter(test => test.ufs.find(u => u.includes(options.match)))
    .flatMap((test: Test) => {
      const cfg: any = {
        stepName: '🧭 Bootstrap ' + test.name,
      };
      if (test.lhBudget && test.lhBudget.length) {
        // cache by filename?
        const budgets: Budget[] = test.lhBudget.map(budget => {
          const b = readBudgets(budget);
          return b.reduce((acc, bb: Budget) => {
            // @ts-ignore
            bb.resourceCounts && (acc.resourceCounts = [...acc.resourceCounts, ...bb.resourceCounts]);
            bb.resourceSizes && (acc.resourceSizes = [...acc.resourceSizes, ...bb.resourceSizes]);
            // @ts-ignore
            bb.timings && (acc.timings = [...acc.timings, ...bb.timings]);
            return acc;
          }, {
            resourceCounts: [],
            resourceSizes: [],
            timings: []
          } as Budget);
        });
        cfg.config = {
          extends: 'lighthouse:default',
          settings: {
            budgets
          }
        }
      }

      return test.urls.map(url => ({url: options.baseUrl ? options.baseUrl + url : url, cfg}));
    });

}
