# Lighthouse Reporting

To get a better understanding ov our progress we us a set of lighthouse tools to get relevant numbers per commit directly in the CI setup.

![lighthouse-ci_tools_michael-hladky](https://user-images.githubusercontent.com/10064416/124685698-10209000-ded2-11eb-81e6-e0cb2416a16d.png)

Lighthouse provides the following tools:

- `@lhci/cli` - A CLI too to spin up websites form the file system or directly from a URL
- `@lhci/server` - A server able to recieve reports over HTTP post requests and a UI displaying the progress over time.


# Setup

![lighthouse-ci_github-action-flow_michael-hladky](https://user-images.githubusercontent.com/10064416/124683232-dbf6a080-decc-11eb-81b5-ebcc6bc547bf.png)

## Setup & Configure Lighthouse-CI CLI

Install the CLI in your repository by running `npm i -D @lhci/cli`

To contorl the CLI place a config file called `lighthouserc.js` at the root of your repo to control the options for Lighthouse CI. 

`echo "module.exports = {ci: { upload: { target: 'temporary-public-storage' } }}" > lighthouserc.js`

For advanced users who'd prefer to use CLI flags or keep the configuration file in another location, refer to the [configuration documentation](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md).

The simple configuration file below is all you need to started test collecting Lighthouse reports and storing them to temporary public storage.

> **Notice ⚠:**
> Temporary storege is publically available over a link

```javascript
module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

Add a script to your `package.json` to be able to run lhci without a global install.

```json
{
  scripts: {
    "lhci": "lhci"
  }
}
```

Now you can test it by running `npm run lhci -- collect --url https://developers.google.com/web/tools/lighthouse` in the repos root directory.

You should see the results in directly the root.

To organize the reporting artefacts better lighthouse-ci will introduce a `.lighthouseci` folder and automatically store the reports in this folder.

## Setup & Connfigure Lighhouse-CI Server

```bash
npm i -D @lhci/server sqlite3
```

Now you can spin up the server persisting to a sqlite db by running:

´npm run lhci -- server --storage.storageMethod=sql --storage.sqlDialect=sqlite --storage.sqlDatabasePath=./db.sql´ 

You may also add this as a script to your `package.json`.

```json
{
  scripts: {
    "lhci-server:start": "npm run lhci -- server --storage.storageMethod=sql --storage.sqlDialect=sqlite --storage.sqlDatabasePath=./db.sql"
  }
}
```

The consol will prompt the port wherer lighthouse-ci is served. (by default 9001)

Open the browser under `http://localhost:9001/app/projects` to test it.

## Connecting the repository to the Lighthouse-CI server

To register a repository to the server be sure to start it first.
Run `npm run lhci-server:start`.

In another console type `npm run lhci wizard`. This will spin up a prompt where you can connect to the server.

> Which wizard do you want to run? **new-project**

> What is the URL of your LHCI server? **http://localhost:9001**

> What would you like to name the project? **[PROJECT_NAME]**

> Where is the project's code hosted? **[URL_TO_REPOSITORY]**

It will redirect you the the server where it prints you the admin and build key.

Open the browser under `http://localhost:9001/app/projects/`. 
You should see the following:
![lighthouse-ci-server_main-page_michael-hladky](https://user-images.githubusercontent.com/10064416/124686557-a6a18100-ded3-11eb-869a-ac73d05d9a81.png)



Take the build key and save it to GitHub as secret under `LHCI_GITHUB_TOKEN`.

Now you should be able to post the reports to the lighthouse-ci server.

Open your `lighthouserc.js` and add following lines:

```javascript
module.exports = {
  ci: {
    collect: {
      // needed if auto discovery is not able to find the projects build artefacts automatically
      staticDistDir: "dist/project-name",
    },
    upload: {
      // save target is a custom lhci server
      target: "lhci",
      // url of the local server
      serverBaseUrl: "http://localhost:9001",
      // token retrieved in the setup and connect step
      token: "BUILD_TOKEN" // could also use LHCI_TOKEN variable instead
    },
  },
};
```

To test it run `npm run lhci -- autorun`.
This should spin up your build and runs lighthouse against it. After it is done it will upload the results to your lhci server instance.

![lighthouse-ci-server_repo-overview_michael-hladky](https://user-images.githubusercontent.com/10064416/124686610-b9b45100-ded3-11eb-9053-e3f6675a0967.png)







