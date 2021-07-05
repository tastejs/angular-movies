
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      staticDistDir: "dist/hub-movies",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
