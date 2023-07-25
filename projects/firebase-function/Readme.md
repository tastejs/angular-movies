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
