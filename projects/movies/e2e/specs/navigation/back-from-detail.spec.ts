import { test, expect } from '../../fixtures/base.fixture';
import { ROUTES } from '../../fixtures/test-data';

test.describe('back navigation', () => {
  test('returns to list from movie detail via back button', async ({
    page,
    movieList,
    movieDetail,
  }) => {
    await page.goto(ROUTES.topRated);
    await movieList.expectLoaded();

    await movieList.openMovieAt(0);
    await movieDetail.expectLoaded();

    await movieDetail.goBack();
    await expect(page).toHaveURL(/\/list\/category\/top_rated/);
    await movieList.expectLoaded();
  });
});
