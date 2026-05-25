# Movies E2E (Playwright)

Functional end-to-end tests for the movies app. Specs live under `specs/` by feature; shared page objects are in `pages/`.

## Run

```bash
npx nx e2e movies
```

OAuth / TMDB login flows and `@auth` specs are skipped by default (see `playwright.config.ts`).

## Structure

```text
e2e/
├── fixtures/       # test.extend, test data, TMDB credentials
├── pages/          # Page Object Model
├── setup/          # auth.setup.ts → storageState
└── specs/          # feature specs (smoke, navigation, search, …)
```

## Login / auth tests (disabled)

TMDB OAuth login, `setup/auth.setup.ts`, and specs tagged `@auth` are skipped. To re-enable authenticated account-page tests, restore the `setup` and `chromium-authenticated` projects in `playwright.config.ts` and remove the unconditional skip in `setup/auth.setup.ts`.

## Tags

| Tag | Runs | Description |
|-----|------|-------------|
| `@smoke` | Yes | Critical paths (home redirect, list routes, 404) |
| `@auth` | No | Skipped — requires TMDB OAuth |

## Cursor + Playwright MCP

The workspace configures [Playwright MCP](https://playwright.dev/docs/getting-started-mcp) in `.cursor/mcp.json` (`testing`, `storage`, `network` capabilities). Use it in Agent chat to explore the app and draft specs — not to replace `nx e2e movies`.

1. Start the app (or reuse an existing server):
   ```bash
   npx nx run movies:serve:development
   ```
2. Reload MCP in Cursor if needed: **Settings → MCP** — confirm `playwright` is running.
3. Example prompts:
   - Navigate to `http://localhost:4200`, walk through sidebar → movie detail, and propose a spec using `e2e/pages/` and `fixtures/base.fixture.ts`.
   - Generate locators for the search bar and add a spec under `e2e/specs/search/`.
   - Mock a failing API route and sketch an assertion for `e2e/specs/errors/`.

For OAuth flows, prefer the existing `storageState` setup (`setup/auth.setup.ts`) for repeatable tests; use MCP storage only for one-off exploration.

**Chrome DevTools MCP** (same config file) attaches to Chrome on port 9222 — useful for inspecting a browser you already launched with remote debugging, separate from Playwright MCP’s own browser.
