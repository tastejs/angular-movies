module.exports = (config) => {
  config.module = {
    ...config.module,

    rules: [
      ...config.module?.rules,

      {
        resourceQuery: /raw/,
        type: 'asset/source',
      },
    ],
  };

  return config;
};
