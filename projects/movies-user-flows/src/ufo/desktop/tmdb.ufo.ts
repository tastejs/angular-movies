import * as fixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';
import {writeFileSync} from "fs";


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
    await this.page.waitForTimeout(6000);

    await this.page.screenshot().then(i => writeFileSync('./approve.jpg', i))
    await this.page.click(fixtures.TmdbCookieBannerBtn).catch(e => {
      console.log('no cookie banner here')
    });
    await this.page.click(fixtures.TmdbCookieSettingsBtn).catch(e => {
      console.log('no cookie settings here')
    });
    await this.page.waitForSelector(fixtures.TmdbLoginSubmitBtn);
    await this.page.click(fixtures.TmdbLoginSubmitBtn);
    await this.page.screenshot().then(i => writeFileSync('./approve2.jpg', i))
    // approve access
    await this.page.waitForSelector(fixtures.TmdbApproveBtn);
    await this.page.click(fixtures.TmdbApproveBtn);
  }

}
