module.exports = {
  ci: {
    collect: {
      // number of reports done to the configured url
      numberOfRuns: 2,
      // needed as auto discovery is not able to find it
      staticDistDir: 'dist/hub-movies',
    },
    upload: {
      // save target is a custom lhci server
      target: 'lhci',
      // url of the local server
      serverBaseUrl: 'http://localhost:9001',
      // token retrieved in the setup and connect step
      token: '99e43e60-74c2-4e91-b6cd-af9a199dd51c', // could also use LHCI_TOKEN variable instead
    },
  },
};
