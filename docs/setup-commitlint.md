# Setup commitlint

## Install
Install [commitlint](https://github.com/conventional-changelog/commitlint) as devDependency. The concept of lint-staged is to run tasks on files that are staged in git.

run: 
`yarn add @commitlint/config-conventional @commitlint/cli --dev`

We use a separate config file to keep package json small.

`echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js`

Test it by running: 
`echo "test" | commitlint` 

It should output

## Test the hook
You can test the hook by simply committing. You should see something like this if everything works.

```bash
⧗   input: test
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky > commit-msg hook failed (add --no-verify to bypass)
```

Add pre-commit hook: `yarn husky add .husky/commit-msg 'yarn commitlint --edit $1'` 

Add helper for autocompletion:

run `yarn add @commitlint/cz-commitlint commitizen --dev` 

Add the following to `package.json`:

```json
{
  "scripts": {
    "commit" : "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

