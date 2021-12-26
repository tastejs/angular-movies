# Setup image optimization

## Install
Install [squoosh](https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli) as devDependency. Squoosh in a CLI as well as web based image optimization tool that can be integrated into your CI pipeline.

run: 
`yarn add @squoosh/lib @squoosh/cli --dev`

Create a file for the custom script:
`echo. 2>squoosh-cli.ts`

Paste following code:

@TODO decide for link vs snippet here

Test it by running: `ts-node -P ./tooling/tsconfig.json  ./tooling/squoosh/index.ts -p / -g=wp2` 

Add the script to the lint-staged config 

Tes by committing.
