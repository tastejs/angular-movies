# Firebase Function

Firebase functions are used to execute the Angular universal express application in the cloud to perform SSR and other
server optimizations.

## Problems

Currently the separation between the 2 apps is statically coded and requires a deep knowledge of the existing code base.
It is also fragile and does not allow save changes of the code.

How does it currently work:

- The `ng-universal-express` application is built in independently before the `firebase-function` build is executed
- The firebase build is a custom `tsc` execution and fragile not integrated well.
  - The source code of the `ng-universal-express` application is used over a `require` statement.
    This is needed to avoid consume the `main.js` bundle built the Angular CLI over webpack.
- The deployment of the `firebase-function` is entangled with the
  static hosting folder structure of the `ng-universal-express` application and the `movies` application.
  This is needed as the express server needs to spin up the Angular application and render it in case already rendered
  version is available.
- The files `firebase.json` and `.firebaserc.json` define the project root.
- Firebase executes npm ci on the server to run the deployment.
  - The closest `package.json` is used to execute the function (defined under the `main` property)
  - This also is used as root in the functions and so in the angular app and affects the assets paths etc.


- file ignore in fb.function.json
- https://www.codejam.info/2023/04/firebase-functions-ignore.html
-       "**/package-lock.json",
-       "**/package.json",
-       "**/projects/**"

ATM

##       

- The root `package.json` is used to execute the function because we dont want to manually maintain the needed
  dependencies
  The files `firebase.json`

- The ignore paths are very hart to use and it it easy to mess them up or upload too many files.

```js
// t is used to have comments
const t = {
  "functions": {
    // This needs to be "." as it references `package.json#main`
    "source": ".",
    // In general the ignore paths are somehow broken:
    // - we can't use negotiation "!". Therefore we have to specifi all manually
    // - every patter is through all paths so === `./node_modules/**` === `node_modules/**` === `**/node_modules/**`  
    //   therefore we put **/ everywhere to make it clear
    "ignore": [
      // Ignores all files starting with "." (folder too?)
      " **/.*",
      // We cant use projects as in our dist we have "dist/projects/[NAME]"
      // "**/projects/**",
      // Folders to ignore
      "**/node_modules/**",
      "**/tmp/**",
      "**/tooling/**",
      // Files to ignore (root level files)
      "**/LICENSE",
      "**/CONTRIBUTING.md",
      "**/README.md",
      "**/commitlint.config.js",
      "**/database.rules.json",
      "**/firebase-debug.log",
      "**/firebase.function.json",
      "**/firebase.hosting.json",
      "**/jest.config.ts",
      "**/jest.preset.js",
      "**/migrations.json",
      "**/nx.json",
      "**/tsconfig.json",
      "**/ui-debug.log",
      "**/wrangler.toml"
    ]
  }
}
``` 
