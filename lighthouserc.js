
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      // staticDistDir: "dist/hub-movies",
    },
    upload: {
      target: "temporary-public-storage",
      // target: "lhci",
      // serverBaseUrl: "http://localhost:9001",
      // token: "98298654-3bb3-46e3-96f2-58058d5d5edb" // could also use LHCI_TOKEN variable instead
    },
  },
};
