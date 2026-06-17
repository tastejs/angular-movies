import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat
    .config({
      plugins: [
        "@typescript-eslint",
        "@angular-eslint",
        "unused-imports",
        "import",
        "simple-import-sort",
      ],
      extends: [],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.ts"],
      rules: {
        ...config.rules,
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "rxjs/operators",
                message: "Please use 'rxjs' instead.",
              },
            ],
          },
        ],
      },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: "./tsconfig.*?.json",
        },
      },
    })),
];
