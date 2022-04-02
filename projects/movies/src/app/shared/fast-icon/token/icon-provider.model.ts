import { LoadIconFunctionSsr } from '../load-svg.ssr.model';

export type IconProvider = {
  id: string;
  defaultSize: number;
  url: (name: string) => string;
  load: LoadIconFunctionSsr;
};
