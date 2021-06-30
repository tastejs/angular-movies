import { HubMoviesPage } from './app.po';

describe('hub-movies App', () => {
  let page: HubMoviesPage;

  beforeEach(() => {
    page = new HubMoviesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
