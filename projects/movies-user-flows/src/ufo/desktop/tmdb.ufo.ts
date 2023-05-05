import * as fixtures from '../../fixtures/tmdb.fixtures';
import {Ufo, UserFlowContext} from '@push-based/user-flow';


export class TmdbUfo extends Ufo {
  constructor(private ctx: UserFlowContext) {
    super(ctx);
  }

  async closeCookieBanner(): Promise<any> {
    await this.page.click(fixtures.TmdbCookieBannerBtn).catch(e => {
      console.log('no cookie banner here')
    });
  }

  async closeCookieSettings(): Promise<any> {
    await this.page.click(fixtures.TmdbCookieSettingsBtn).catch(e => {
      console.log('no cookie settings here')
    });
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

    await this.page.waitForSelector(fixtures.TmdbLoginSubmitBtn, {timeout: 60000});
    await this.page.click(fixtures.TmdbLoginSubmitBtn);

    // approve access
    await this.page.waitForSelector(fixtures.TmdbApproveBtn, {timeout: 60000});
    await this.page.click(fixtures.TmdbApproveBtn);
  }

}
