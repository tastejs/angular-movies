# Setup Project Defaults TLDR

**TLDR**

1. Install `yarn add husky lint-staged prettier @commitlint/config-conventional @commitlint/cli @commitlint/cz-commitlint commitizen --dev`


2. Add husky script `npx npm-add-script -k husky -v "husky"`

3. Add prepare script `npx npm-add-script -k prepare -v "husky install"`

4. Setup `yarn prepare`


5. Add .prettierignore `echo # Add files here to ignore them from prettier formatting \\n dist  coverage > .prettierignore`

6. Add .prettierrc.json `echo { "singleQuote": true } > .prettierrc.json`

7. Add format:all script: `npx npm-add-script -k format:all -v "prettier --write ."`


8. Add lintstagedrc `echo { "*.ts": ["prettier --write", "tslint --fix"], "*.scss": ["prettier --write", "stylelint --fix"], "*.{html,js,json}": ["prettier --write"] } > .lintstagedrc.json`

9. Add pre-commit hook: `yarn husky -- add .husky/pre-commit "yarn lint-staged"`


10. Add commitlint.config.js `echo module.exports = {extends: ['@commitlint/config-conventional']} > commitlint.config.js`

11. Add pre-commit hook: `yarn husky add .husky/commit-msg "yarn commitlint --edit $1"` 

12. Add husky script `npx npm-add-script -k commit -v "git-cz"`

13. Add commitizen config to package.json

```json
{
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```






