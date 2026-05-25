import { test, expect } from '../../fixtures/base.fixture';

test.describe('not found @smoke', () => {
  test('redirects unknown paths and links back to popular', async ({
    page,
    notFound,
    movieList,
  }) => {
    await page.goto('/does-not-exist');
    await expect(page).toHaveURL(/\/page-not-found/, { timeout: 30_000 });
    await notFound.expectLoaded();

    await notFound.goToPopular();
    await expect(page).toHaveURL(/\/list\/category\/popular/);
    await movieList.expectLoaded();
  });
});
