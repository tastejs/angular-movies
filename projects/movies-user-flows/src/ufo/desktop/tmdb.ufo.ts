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
    await this.page.waitForTimeout(6000);
    console.log('path: ', process.cwd())
    //   await this.page.screenshot().then(i => writeFileSync('./projects/movies-user-flows/src/measures/approve.jpg', i))
    // approve access
    //  await this.page.waitForSelector(fixtures.TmdbApproveBtn);
    //  await this.page.click(fixtures.TmdbApproveBtn);
  }

}
