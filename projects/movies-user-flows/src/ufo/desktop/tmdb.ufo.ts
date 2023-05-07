import * as fixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export class TmdbUfo extends Ufo {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async login(): Promise<any> {
    // go to log in form
    await this.page.waitForSelector(fixtures.TmdbLoginBtn);
    await this.page.click(fixtures.TmdbLoginBtn);

    // fill and send form
    await this.page.waitForSelector(fixtures.TmdbUsernameInput);
    await this.page.type(fixtures.TmdbUsernameInput, fixtures.TmdbUser);

    await this.page.waitForSelector(fixtures.TmdbPasswordInput);
    await this.page.type(fixtures.TmdbPasswordInput, fixtures.TmdbPassword);

    await this.page.waitForSelector(fixtures.TmdbLoginSubmitBtn);
    await this.page.click(fixtures.TmdbLoginSubmitBtn);
    /*
    * All logic from here on is hacky.
    * It is only needed to make the test pass in CI and the real problem is unclear for now.
    * The whole section needs a refactor. Sry :)
    * */
    await this.page.waitForTimeout(6000);

    await this.page.waitForSelector(fixtures.TmdbLoginSubmitBtn);
    await this.page.click(fixtures.TmdbLoginSubmitBtn);
    await this.page.waitForTimeout(6000);

    // approve access
    await this.page.waitForTimeout(6000);

    await this.page.waitForSelector(fixtures.TmdbApproveBtn, {timeout: 60000});
    await this.page.click(fixtures.TmdbApproveBtn);
  }

}
