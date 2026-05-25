import { test } from '../../fixtures/base.fixture';
import { ROUTES } from '../../fixtures/test-data';

test.describe('sidebar navigation', () => {
  test('opens top rated from menu and navigates to movie detail', async ({
    page,
    sidebar,
    movieList,
    movieDetail,
  }) => {
    await page.goto(ROUTES.popular);
    await movieList.expectLoaded();

    await sidebar.navigateToCategory('topRated');
    await movieList.expectLoaded();

    await movieList.openMovieAt(0);
    await movieDetail.expectLoaded();
  });
});
