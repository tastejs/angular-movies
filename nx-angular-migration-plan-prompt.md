# Nx and Angular Migration Command Summary

Use this prompt as a concise record of the successful commands executed for the Nx 19 and Angular 19 migration.

## Migration Goal

Migrate the workspace Nx packages to version 19, migrate Angular packages to version 19, and verify the Angular/Nx workspace still builds.

## Commands Executed

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 20.18.1
```

```sh
npx nx migrate 19
```

```sh
npm install
```

```sh
npx nx report
```

```sh
npx nx migrate nx@19.8.14
```

```sh
npm install
```

```sh
npm install --save-dev --save-exact @angular/cli@18.2.21
```

```sh
npx nx report
```

```sh
npx nx run movies:build
```

## Result

The migration updated Nx-related packages to `19.8.14`, kept Angular CLI aligned at `18.2.21`, refreshed `package-lock.json`, did not generate any new Nx 19 migrations to run, and completed the `movies:build` target successfully.

## Angular Update Analysis

Run `npx ng update` after the Nx 19 migration to inspect the next Angular migration target.

Target Angular migration version: `19.2.9`.

```sh
npx ng update @angular/cli@19.2.9 @angular/core@19.2.9
```

The update analysis reported these available package updates:

```text
We analyzed your package.json, there are some packages to update:

   Name                                    Version                  Command to update
  -------------------------------------------------------------------------------------
   @angular-eslint/schematics              18.4.3 -> 21.4.0         ng update @angular-eslint/schematics
   @angular/cli                            18.2.21 -> 19.2.9        ng update @angular/cli@19
   @angular/core                           18.2.14 -> 19.2.9        ng update @angular/core@19
   @nx/angular                             19.8.14 -> 22.7.3        ng update @nx/angular
   @nx/esbuild                             19.8.14 -> 22.7.3        ng update @nx/esbuild
   @nx/vitest                              testing                  npm install -D @nx/vitest vitest jsdom
   @nx/js                                  19.8.14 -> 22.7.3        ng update @nx/js
   @nx/node                                19.8.14 -> 22.7.3        ng update @nx/node
   @nx/webpack                             19.8.14 -> 22.7.3        ng update @nx/webpack
   @rx-angular/cdk                         18.0.0 -> 21.1.0         ng update @rx-angular/cdk
   @rx-angular/state                       18.1.0 -> 21.1.1         ng update @rx-angular/state
   @rx-angular/template                    18.0.3 -> 21.2.0         ng update @rx-angular/template
   nx                                      19.8.14 -> 22.7.3        ng update nx

There might be additional packages which don't provide 'ng update' capabilities that are outdated.
You can update the additional packages by running the update command of your package manager.
```

## Angular 19 Migration Commands

Use a Node version accepted by the Angular CLI migration runner:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22.12.0
```

Install the requested version 19 package set:

```sh
npm install --force
```

Run Angular migration-only scripts:

```sh
npx ng update @angular/core --migrate-only --from 18.2.14 --to 19.2.9 --allow-dirty --force
```

```sh
npx ng update @angular/cli --migrate-only --from 18.2.21 --to 19.2.9 --allow-dirty --force
```

```sh
npx ng update @angular-eslint/schematics --migrate-only --from 18.4.3 --to 19.8.1 --allow-dirty --force
```

Verify the migrated workspace:

```sh
npx nx report
```

```sh
npx nx run movies:build
```

## Angular 19 Result

The migration updated Angular packages to `19.2.9`, Angular ESLint packages to `19.8.1`, RxAngular packages to version 19, kept Nx packages at `19.8.14`, ran the Angular core migration-only scripts, updated SSR imports for Angular 19, and completed the `movies:build` target successfully with Sass deprecation and unused-import warnings.
