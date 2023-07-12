# General

## Task Hierarchy

```mermaid
graph TD;
    lint-->build;
    build-->test;
    build-->prerender;
    prerender-->test;
    test-->deploy;
    test-->user-flow;
    deploy-->user-flow;
```

## App Hierarchy

The repository maintains the following projects:

- angular-movies - a Angular application served in a web browser
- ng-universal-express - a node express server using `@nguniversal` for SSR and SSG of the angular-movies
- firebase-function - a firebase function used to execute SSR of the ng-universal-express in firebase functions
- cloudflare-worker - a cloudflare worker used to execute SSR of the angular-movies app in a worker


```mermaid
graph TD;
    docs
    angular-movies-user-flow;
    firebase-function-->ng-universal-express;
    ng-universal-express-->angular-movies;
    cloudflare-worker-->angular-movies;
```

## Project Types

We consider the following types a archetypal project:

- Browser Application - maintaining an application served in the web e.g. Angular
- Angular Universal Express Application - maintaining a node express server for Angular and the related projects
- Firebase Function Application - maintaining a node function hosted on firebase cloud functions

## Global Project Targets (`nx.json`)

In this mono repository we agree on a set of tasks that need to be consistent across the platforms:

### Tasks (`nx.json#targetDefaults`)

- **format** - global formatting
- **lint** - global linting
- **build** - build project for different reasond
  - **development-x** - environments fast to build and easy to debug. No perf measures.
- **serve** - TODO
- **test** - TODO
- **e2e** - e2e tests with optional postfix (if no postfix is needed use just `e2e`)
- **emulate-x** - emulated environments
- **deploy-x** - deployment targets
- **user-flow** - e2e tests inc lighthouse measures
  - **development-x** - environments fast to start and easy to debug. No perf measures.
  - **production-x** - environments close to the released version
  - **emulated-x** - emulated environments

## Projects (`nx.json#layout`)

### Docs

#### Tasks

- **format** - Markdown specific formatting
- **lint** - TODO
- **build-report** - `state.json` and bundle analyzer generation
- **update-readme** - update the main readme (`./README.md`) with data from our builds and reports

### Browser Application

The browser application is needed to run host a CRS version of the application as well as all static files e.g.
pre-rendered pages or `routes.txt`

#### Tasks

- **format** - Angular specific formatting
- **lint** - TODO
- **build** - the executor `browser` from the package `@angular-devkit/build-angular` is used
  - **production**
  - **development**
- **serve** - the executor `dev-server` from the package `@angular-devkit/build-angular` is used
  - **production** - TODO
  - **development** - TODO

- **ngsw-config** - TODO
- **serve:ngsw** - TODO

- **test** - TODO
- **e2e** - TODO
- **emulate-firebase** - firebase hosting emulation over `firebase` CLI
- **deploy-firebase** - We deploy over a GH action. This is be used optionally.  
  It deploys the CSR version of the application excluding the pre-generated sites.
- **user-flow** - co-located e2e tests
  - **development** - `build` for `development`. `serve` it with the `development` option.  
    XY tests are executed with `--dryRun`.
  - **production** - `build` for `pruduction`. `serve` it with the `pruduction` option.  
    XY tests are executed.
  - **emulated** - `build` for `pruduction`. `serve` it with the `emulate-firebase` task.  
    XY tests are executed.
- **build-report** - `state.json` and bundle analyzer generation
- **update-readme** - update the main readme (`./README.md`) with data from our builds and reports

### Express Server

The ng-universal application is needed to run SSR in different environments e.g. function or edge.

#### Tasks

- **format** - node specific formatting
- **lint** - TODO
- **build** - the executor `server` from the package `@angular-devkit/build-angular` is used
  - **development** - TODO
  - **production** - TODO
  - **serve-production** - includes the automatic startup logic needed for `@nguniversal/builders:ssr-dev-server`
  - **serve-development** - includes the automatic startup logic needed for `@nguniversal/builders:ssr-dev-server`
- **serve** - the executor `ssr-dev-server` from the package `@nguniversal/builders` is used
  - **development** - TODO
  - **production** - TODO
- **test** - TODO
- **e2e** - TODO
- **pre-prerender** - precondition logic prerender e.g. preparation of `routs.txt`
- **prerender** - the executor `prerender` from the package `@nguniversal/builders` is used
- **emulate-firebase** - firebase hosting emulation over `firebase` CLI
- **user-flow** - co-located e2e tests
  - **development** - `build` for `development`. `serve` it with the `serve-development` options  
    XY tests are executed with `--dryRun`.
  - **production** - `build` for `pruduction`. `serve` it with the `serve-pruduction` options.  
    XY tests are executed.
  - **emulated** - `build` for `pruduction` and run `prerender`. `serve` it with the `emulate-firebase` task.  
    XY tests are executed.

### Cloud Function

The firebase-function application is needed to execute the ng-universal express server in a cloud function.

#### Tasks

- **format** - esm specific formatting
- **build** - `tsc` is used directly
- **emulate-firebase** - firebase function emulation over `firebase` CLI
- **deploy-firebase** - We deploy over a GH action. This can be used optionally
  It deploys the firebase function as well as the CSR version including all pre-rendered pages of the application.
  The firebase CLI deploys hosting and functions.
- **user-flow** - co-located e2e tests
  - **emulated** - `build` for `pruduction` and run `prerender`. `serve` it with the `emulate-firebase` task.  
    XY tests are executed.

### User Flows

#### ???

To test a applications with user flow we consider the following libs/apps:

- **{centralized}-user-flows** - globally shared user-flow logic or tests
  - **test-data/index.ts** - global fixtures, data, budgets
  - **/src/index.ts** - configurable UFO objects entry point
  - **/user-flows** - folder for shared user flows
- **{application}**
  - **/test** - co-located user-flow tests logic
  - **/user-flows** - co-located user-flow tests

The user-flows application is needed to execute e2e tests against the different deployments.

#### Tasks

- **format** - exception rules for the different code parts
- TODO
