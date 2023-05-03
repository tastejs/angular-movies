import * as fixtures from '../../fixtures/toolbar.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export class TmdbUfo extends Ufo {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async fillLoginForm(): Promise<any> {
    await this.page.waitForSelector(fixtures.TmdbUsernameInput);
    await this.page.type(fixtures.TmdbUsernameInput, fixtures.TmdbUser);
    await this.page.waitForSelector(fixtures.TmdbPasswordInput);
    await this.page.type(fixtures.TmdbPasswordInput, fixtures.TmdbPassword);
    await this.page.click(fixtures.TmdbLoginSubmitBtn)
  }

  async login(): Promise<any> {
    if (!this.page.url().includes(fixtures.TmdbAuthUrl)) {
      throw new Error('Login page not open')
    }
    // navigate to tmdb login form
    await this.page.click(fixtures.TmdbLoginBtn);

    if (!this.page.url().includes(fixtures.TmdbAuthUrl)) {
      throw new Error('navigate to login form failed')
    }
    // fill and send form
    await this.page.waitForSelector(fixtures.TmdbUsernameInput);
    await this.page.type(fixtures.TmdbUsernameInput, fixtures.TmdbUser);
    await this.page.waitForSelector(fixtures.TmdbPasswordInput);
    await this.page.type(fixtures.TmdbPasswordInput, fixtures.TmdbPassword);
    await this.page.click(fixtures.TmdbLoginSubmitBtn)
    // navigate back to movies app
    await this.page.waitForNavigation().catch(() => {
      throw new Error('Navigation to movies app failed')
    });
    if (!this.page.url().includes('angular-movies')) {
      throw new Error('Login page not open')
    }
    // check login state

  }

}
