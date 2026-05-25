import { test, expect } from '../../fixtures/base.fixture';
import { ROUTES } from '../../fixtures/test-data';

test.describe('home redirect @smoke', () => {
  test('redirects root to popular list', async ({ page, movieList }) => {
    await page.goto(ROUTES.home);
    await expect(page).toHaveURL(/\/list\/category\/popular/, {
      timeout: 30_000,
    });
    await movieList.expectLoaded();
  });
});
