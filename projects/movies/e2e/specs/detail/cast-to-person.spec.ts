import { test, expect } from '../../fixtures/base.fixture';
import { MOVIE_ID, ROUTES } from '../../fixtures/test-data';

test.describe('cast navigation', () => {
  test('opens person detail from movie cast list', async ({
    page,
    movieDetail,
    personDetail,
  }) => {
    await page.goto(ROUTES.movieDetail(MOVIE_ID));
    await movieDetail.expectCastVisible();

    await movieDetail.openCastAt(0);
    await expect(page).toHaveURL(/\/detail\/person\/\d+/, {
      timeout: 30_000,
    });
    await personDetail.expectLoaded();
  });
});
