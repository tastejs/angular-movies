import { expect, test } from '../../fixtures/base.fixture';
import { MOVIE_ID, ROUTES } from '../../fixtures/test-data';
import { movieImgSelector } from 'test-selectors';

test.describe('API failure handling', () => {
  test('shows loader when movie detail API fails', async ({
    page,
    movieDetail,
  }) => {
    await page.route('**/3/movie/**', (route) =>
      route.fulfill({ status: 500, body: '{}' }),
    );

    await page.goto(ROUTES.movieDetail(MOVIE_ID));
    await movieDetail.expectLoaderVisible();
    await movieDetail.expectHeroHidden();
  });

  test('shows no movie cards when list API fails', async ({ page }) => {
    await page.route('**/3/movie/popular**', (route) =>
      route.fulfill({ status: 500, body: '{}' }),
    );

    await page.goto(ROUTES.popular);
    await expect(page.locator(movieImgSelector(0))).toBeHidden({
      timeout: 30_000,
    });
  });
});
