declare const manifest: {
  basePath: string;
  allowedHosts: readonly string[];
  supportedLocales: Readonly<Record<string, string>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entryPoints: Readonly<Record<string, (() => Promise<any>) | undefined>>;
};
export default manifest;
