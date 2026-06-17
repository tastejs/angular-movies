import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import baseConfig from "../../eslint.config.mjs";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...baseConfig,
  ...compat
    .config({
      extends: [
        "plugin:playwright/recommended",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:@rx-angular/eslint-plugin/recommended",
      ],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
      rules: {
        ...config.rules,
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["@angular/common"],
                importNames: ["CommonModule"],
                message:
                  "Use the component or directive directly e.g. `import {NgFor} from '@angular/common'`.",
              },
            ],
          },
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: ["app", "ct"],
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: ["app", "ct"],
            style: "kebab-case",
          },
        ],
      },
      languageOptions: {
        parserOptions: {
          project: "./tsconfig.*?.json",
        },
      },
    })),
  ...compat
    .config({
      extends: [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility",
      ],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.html"],
      rules: {
        ...config.rules,
      },
    })),
  {
    files: ["e2e/**/*.{ts,js,tsx,jsx}"],
    rules: {
      "@rx-angular/prefer-no-layout-sensitive-apis": "off",
      "playwright/expect-expect": [
        "warn",
        {
          assertFunctionNames: [
            "expectLoaded",
            "expectLoaderVisible",
            "expectHeroHidden",
            "expectCastVisible",
            "enableDarkMode",
            "enableLightMode",
          ],
        },
      ],
    },
  },
];
