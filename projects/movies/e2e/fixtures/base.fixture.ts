import { test as base } from '@playwright/test';
import { AccountListPage } from '../pages/account/account-list.page';
import { ListCreatePage } from '../pages/account/list-create.page';
import { AppShellPage } from '../pages/app-shell.page';
import { MovieDetailPage } from '../pages/movie-detail.page';
import { MovieListPage } from '../pages/movie-list.page';
import { NotFoundPage } from '../pages/not-found.page';
import { PersonDetailPage } from '../pages/person-detail.page';
import { SidebarPage } from '../pages/sidebar.page';
import { TmdbAuthPage } from '../pages/tmdb-auth.page';
import { ToolbarPage } from '../pages/toolbar.page';

type PageObjects = {
  appShell: AppShellPage;
  sidebar: SidebarPage;
  movieList: MovieListPage;
  movieDetail: MovieDetailPage;
  personDetail: PersonDetailPage;
  notFound: NotFoundPage;
  toolbar: ToolbarPage;
  tmdbAuth: TmdbAuthPage;
  accountList: AccountListPage;
  listCreate: ListCreatePage;
};

export const test = base.extend<PageObjects>({
  appShell: async ({ page }, use) => use(new AppShellPage(page)),
  sidebar: async ({ page }, use) => use(new SidebarPage(page)),
  movieList: async ({ page }, use) => use(new MovieListPage(page)),
  movieDetail: async ({ page }, use) => use(new MovieDetailPage(page)),
  personDetail: async ({ page }, use) => use(new PersonDetailPage(page)),
  notFound: async ({ page }, use) => use(new NotFoundPage(page)),
  toolbar: async ({ page }, use) => use(new ToolbarPage(page)),
  tmdbAuth: async ({ page }, use) => use(new TmdbAuthPage(page)),
  accountList: async ({ page }, use) => use(new AccountListPage(page)),
  listCreate: async ({ page }, use) => use(new ListCreatePage(page)),
});

export { expect } from '@playwright/test';
