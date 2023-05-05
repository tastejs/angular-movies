import * as fixtures from '../../fixtures/tmdb.fixtures';
import * as tmdbfixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export class TmdbUfo extends Ufo {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async login(): Promise<any> {
    // go to login form
    await this.page.waitForSelector(fixtures.TmdbLoginBtn);
    await this.page.click(fixtures.TmdbLoginBtn);

    // fill and send form
    await this.page.waitForSelector(fixtures.TmdbUsernameInput);
    await this.page.type(fixtures.TmdbUsernameInput, fixtures.TmdbUser);

    await this.page.waitForSelector(fixtures.TmdbPasswordInput);
    await this.page.type(fixtures.TmdbPasswordInput, fixtures.TmdbPassword);

    await this.page.waitForSelector(fixtures.TmdbLoginSubmitBtn);
    await this.page.click(fixtures.TmdbLoginSubmitBtn);

    // approve access
    await this.page.waitForResponse(r => r.url().includes(tmdbfixtures.TmdbAuthUrl))
      .catch(() => {
        throw new Error('Navigation to approve failed')
      });
    await this.page.waitForSelector(fixtures.TmdbApproveBtn);
    await this.page.click(fixtures.TmdbApproveBtn);
  }

}
