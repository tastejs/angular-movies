export type UserFlowFn = (cfg: any) => Promise<any>;

export type UserFlow = {
  name: string;
  report: UserFlowFn;
};
export type UserFlowConfig = {
  targetUrl: string;
  flows: UserFlow[];
  dist: string;
};
