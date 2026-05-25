import { test, expect } from '../../fixtures/base.fixture';
import { MOVIE_ID, PERSON_ID, ROUTES } from '../../fixtures/test-data';
import { heandlineSelector, heroImageSelector } from 'test-selectors';

test.describe('detail routes @smoke', () => {
  test('renders movie and person detail pages when visited directly', async ({
    page,
    movieDetail,
    personDetail,
  }) => {
    await page.goto(ROUTES.movieDetail(MOVIE_ID));
    await expect(page.locator(heandlineSelector)).toBeVisible({
      timeout: 30_000,
    });
    await movieDetail.expectLoaded();

    await page.goto(ROUTES.personDetail(PERSON_ID));
    await personDetail.expectLoaded();
    await expect(page.locator(heroImageSelector)).toBeVisible({
      timeout: 30_000,
    });
  });
});
