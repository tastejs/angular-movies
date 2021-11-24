function patchWebpackPostcssPlugins({
                                      webpackConfig,
                                      addPlugins = [],
                                      pluginName = null,
                                      append = false,
                                      atIndex = null,
                                      components = true,
                                      global = true,
                                    }) {
  const position = append ? 1 : 0;
  webpackConfig.module.rules.map((rule) => {
    if (!(rule.use && rule.use.length > 0) || (!components && rule.exclude) || (!global && rule.include)) {
      return rule;
    }
    rule.use.map((useLoader) => {
      if (!(useLoader.options && useLoader.options.postcssOptions)) {
        return useLoader;
      }
      const postcssOptions = useLoader.options.postcssOptions;
      useLoader.options.postcssOptions = (loader) => {
        const _postcssOptions = postcssOptions(loader);
        const pluginIndex =
          atIndex !== null
            ? atIndex
            : _postcssOptions.plugins.findIndex(
            ({ postcssPlugin }) =>
              postcssPlugin && pluginName && postcssPlugin.toLowerCase() === pluginName.toLowerCase()
            );
        if (pluginName && pluginIndex === -1) {
          console.warn(`${pluginName} not found in postcss plugins`);
        }
        console.log('pluginName', pluginName);
        const insertIndex =
          pluginIndex >= 0
            ? Math.min(Math.max(pluginIndex, 0), _postcssOptions.plugins.length)
            : _postcssOptions.plugins.length;
        _postcssOptions.plugins.splice(insertIndex + position, 0, ...addPlugins);
        return _postcssOptions;
      };
      return useLoader;
    });
    return rule;
  });
}

module.exports = (config) => {
  const csso = require('postcss-csso');
  patchWebpackPostcssPlugins({
    webpackConfig: config,
    addPlugins: [],
    // pluginName: "autoprefixer",
    // global: false,
    // components: false,
    // atIndex: 2,
    // append: false,
  });
  console.info('CSSO', config);
  return config;
};
