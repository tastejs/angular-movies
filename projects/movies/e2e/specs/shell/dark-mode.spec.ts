import { test } from '../../fixtures/base.fixture';
import { ROUTES } from '../../fixtures/test-data';

test.describe('dark mode', () => {
  test('toggles body theme class', async ({ page, appShell }) => {
    await page.goto(ROUTES.popular);

    await appShell.enableDarkMode();
    await appShell.enableLightMode();
  });
});
