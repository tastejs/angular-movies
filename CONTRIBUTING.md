## General

Tasks:

- lint
- build
- test
- serve

## Browser

The browser application is needed to run host a CRS version of the application as well as all static files e.g.
pre-rendered pages or `routes.txt`

Custom Tasks:

- build-report
- update-readme

## Express Server

The ng-universal application is needed to run SSR in different environments e.g. function or edge.

Custom Tasks:

- pre-prerender
- prerender

## Cloud Function

The firebase-function application is needed to execute the ng-universal express server in a cloud function.

Custom Tasks:

- deploy

## User Flows

The user-flows application is needed to execute e2e tests against the different deployments.

Custom Tasks:

- user-flow
