
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 10,
      // needed as auto discovery is not able to find it
      staticDistDir: "dist/hub-movies",
    },
    upload: {
      // save target is a custom lhci server
      target: "lhci",
      // url of the local server
      serverBaseUrl: "http://localhost:9001",
      // token retrieved in the setup and connect step
      token: "98298654-3bb3-46e3-96f2-58058d5d5edb" // could also use LHCI_TOKEN variable instead
    },
  },
};
