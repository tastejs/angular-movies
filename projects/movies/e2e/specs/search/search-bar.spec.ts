import { test, expect } from '../../fixtures/base.fixture';
import { ROUTES, SEARCH_TERM } from '../../fixtures/test-data';
import { heandlineSelector } from 'test-selectors';

test.describe('search bar', () => {
  test('submits a query and resets on empty search', async ({
    page,
    appShell,
    movieList,
  }) => {
    await page.goto(ROUTES.popular);

    await appShell.search(SEARCH_TERM);
    await expect(page).toHaveURL(
      new RegExp(`/list/search/${SEARCH_TERM}`, 'i'),
      { timeout: 30_000 },
    );
    await expect(page.locator(heandlineSelector)).toBeVisible();
    await movieList.expectLoaded();

    await appShell.search('');
    await expect(page).toHaveURL(/\/list\/category\/popular/);
    await movieList.expectLoaded();
  });
});
