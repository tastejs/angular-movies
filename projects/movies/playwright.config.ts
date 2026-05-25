import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const playwrightConfigPath = fileURLToPath(import.meta.url);

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

const isCi = !!(process.env['CI'] || process.env['GITHUB_ACTIONS']);

/** OAuth setup, TMDB login pages, and authenticated account specs are skipped. */
const loginTestIgnore = [
  /auth\.setup\.ts/,
  /account-pages\.spec\.ts/,
  /specs\/auth\//,
];

export default defineConfig({
  ...nxE2EPreset(playwrightConfigPath, { testDir: './e2e' }),
  timeout: 60_000,
  expect: { timeout: 30_000 },
  grepInvert: /@auth/,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: isCi
      ? 'npx nx run movies:serve:development'
      : 'bash scripts/with-node.sh nx run movies:serve:development',
    url: 'http://localhost:4200',
    reuseExistingServer: !isCi,
    cwd: workspaceRoot,
    timeout: 180_000,
    wait: {
      stdout: /Local:\s+http:\/\/localhost:4200/,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: loginTestIgnore,
    },
    ...(process.env['PLAYWRIGHT_ALL_BROWSERS'] === '1'
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
            testIgnore: loginTestIgnore,
          },
          ...(process.env['PLAYWRIGHT_WEBKIT'] === '1'
            ? [
                {
                  name: 'webkit',
                  use: { ...devices['Desktop Safari'] },
                  testIgnore: loginTestIgnore,
                },
              ]
            : []),
        ]
      : []),
  ],
});
