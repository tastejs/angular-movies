import { type Page, type Response } from '@playwright/test';
import {
  tmdbApproveBtn,
  tmdbAuthStepTimeout,
  tmdbAuthUrlPart,
  tmdbCookieRejectAllBtn,
  tmdbE2ePassword,
  tmdbE2eUser,
  tmdbLoginBtn,
  tmdbLoginSubmitBtn,
  tmdbPasswordInput,
  tmdbUsernameInput,
} from '../fixtures/tmdb';
import {
  waitForAuthReturnToApp,
  waitForSessionReady,
} from '../fixtures/auth-helpers';
import { ROUTES } from '../fixtures/test-data';

export class TmdbAuthPage {
  constructor(private readonly page: Page) {}

  private approveButton() {
    return this.page
      .getByRole('button', { name: /^Approve$/i })
      .or(this.page.locator(tmdbApproveBtn));
  }

  private async dismissCookieBanner(): Promise<void> {
    const cookieReject = this.page.locator(tmdbCookieRejectAllBtn).first();
    await cookieReject
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);
    if (await cookieReject.isVisible().catch(() => false)) {
      await cookieReject.evaluate((btn) => (btn as HTMLButtonElement).click());
      await cookieReject
        .waitFor({ state: 'hidden', timeout: 10_000 })
        .catch(() => undefined);
    }
  }

  private waitForAccessTokenExchange(
    timeout = tmdbAuthStepTimeout,
  ): Promise<Response> {
    return this.page.waitForResponse(
      (r) =>
        r.url().includes('/4/auth/access_token') &&
        r.request().method() === 'POST',
      { timeout },
    );
  }

  async login(): Promise<void> {
    const stepTimeout = tmdbAuthStepTimeout;

    await this.page.locator(tmdbLoginBtn).waitFor({ timeout: stepTimeout });
    await this.page.locator(tmdbLoginBtn).click();

    await this.dismissCookieBanner();

    await this.page
      .locator(tmdbUsernameInput)
      .waitFor({ timeout: stepTimeout });
    await this.page.locator(tmdbUsernameInput).pressSequentially(tmdbE2eUser, {
      delay: 50,
    });

    await this.page
      .locator(tmdbPasswordInput)
      .waitFor({ timeout: stepTimeout });
    await this.page
      .locator(tmdbPasswordInput)
      .pressSequentially(tmdbE2ePassword, { delay: 50 });

    await this.page
      .locator(tmdbLoginSubmitBtn)
      .waitFor({ timeout: stepTimeout });

    await Promise.all([
      this.page.waitForURL((url) => url.href.includes(tmdbAuthUrlPart), {
        timeout: stepTimeout,
      }),
      this.page.locator(tmdbLoginSubmitBtn).click(),
    ]);

    const approve = this.approveButton();
    await approve.waitFor({ state: 'visible', timeout: stepTimeout });

    const accessTokenExchange = this.waitForAccessTokenExchange(stepTimeout);

    await Promise.all([
      this.page.waitForURL(`**${ROUTES.popular}*`, {
        timeout: stepTimeout,
        waitUntil: 'commit',
      }),
      approve.click(),
    ]);

    await accessTokenExchange.catch(() => null);
    await waitForSessionReady(this.page, stepTimeout);
    await waitForAuthReturnToApp(this.page);
  }
}
