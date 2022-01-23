export const defaultRedirectRoute = 'list/category/popular';
export const fallbackRouteToDefault = (route: string) =>
  route !== '/' ? route : defaultRedirectRoute;
