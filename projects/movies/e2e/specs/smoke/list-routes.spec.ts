import { test } from '../../fixtures/base.fixture';
import { LIST_ROUTES } from '../../fixtures/test-data';

test.describe('list routes @smoke', () => {
  test('renders movie list pages when visited directly', async ({
    page,
    movieList,
  }) => {
    for (const route of LIST_ROUTES) {
      await page.goto(route);
      await movieList.expectLoaded();
    }
  });
});
