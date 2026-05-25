import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const debugDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../.debug',
);

let logFilePath: string | null = null;
let stepCounter = 0;

/** Set E2E_MENU_DEBUG=0 to disable. Enabled by default for local auth debugging. */
export function isMenuDebugEnabled(): boolean {
  return process.env['E2E_MENU_DEBUG'] !== '0';
}

export function initMenuDebug(testName: string): string | null {
  if (!isMenuDebugEnabled()) {
    return null;
  }

  fs.mkdirSync(debugDir, { recursive: true });
  const slug = testName.replace(/[^\w-]+/g, '-').replace(/-+/g, '-');
  logFilePath = path.join(debugDir, `profile-menu-${slug}-${Date.now()}.log`);
  stepCounter = 0;

  append(`profile menu debug log`);
  append(`test: ${testName}`);
  append(`started: ${new Date().toISOString()}`);
  append(`log file: ${logFilePath}`);
  append('');

  // eslint-disable-next-line no-console
  console.log(`[menu-debug] writing to ${logFilePath}`);

  return logFilePath;
}

export function getMenuDebugLogPath(): string | null {
  return logFilePath;
}

function append(line: string): void {
  if (!logFilePath) {
    return;
  }
  fs.appendFileSync(logFilePath, `${line}\n`, 'utf8');
}

export function logMenuDebugMessage(step: string, message: string): void {
  if (!logFilePath) {
    return;
  }
  stepCounter += 1;
  append(`--- step ${stepCounter}: ${step} ---`);
  append(message);
  append('');
}

export function logMenuDebugError(step: string, error: unknown): void {
  const message =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  logMenuDebugMessage(step, `ERROR: ${message}`);
}

export async function logMenuDebug(
  page: Page,
  step: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  if (!logFilePath) {
    return;
  }

  stepCounter += 1;
  append(`--- step ${stepCounter}: ${step} ---`);

  try {
    const snapshot = await captureMenuSnapshot(page);
    append(JSON.stringify({ ...snapshot, ...extra }, null, 2));
  } catch (error) {
    append(
      JSON.stringify(
        {
          captureError: error instanceof Error ? error.message : String(error),
          ...extra,
        },
        null,
        2,
      ),
    );
  }

  append('');
}

async function captureMenuSnapshot(
  page: Page,
): Promise<Record<string, unknown>> {
  const viewport = page.viewportSize();
  const playwrightVisible = {
    profileButton: await page
      .locator('[data-uf="profile-menu-button"]')
      .isVisible()
      .catch(() => false),
    profileContent: await page
      .locator('[data-uf="profile-menu-content"]')
      .isVisible()
      .catch(() => false),
    loginItem: await page
      .locator('[data-uf="profile-menu-item-login"]')
      .isVisible()
      .catch(() => false),
    signoutItem: await page
      .locator('[data-uf="profile-menu-item-signout"]')
      .isVisible()
      .catch(() => false),
    accountMenuAttached: await page
      .locator('app-account-menu')
      .count()
      .then((n) => n > 0)
      .catch(() => false),
  };

  const dom = await page.evaluate(() => {
    const describeElement = (el: Element | null) => {
      if (!el) {
        return { exists: false };
      }
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        exists: true,
        matchesHover: el.matches(':hover'),
        visibility: style.visibility,
        display: style.display,
        pointerEvents: style.pointerEvents,
        opacity: style.opacity,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
      };
    };

    const dropdown = document.querySelector('.account-menu-dropdown');
    const button = document.querySelector('[data-uf="profile-menu-button"]');
    const content = document.querySelector('[data-uf="profile-menu-content"]');
    const accountMenu = document.querySelector('app-account-menu');

    const elementAtButtonCenter = (() => {
      if (!(button instanceof Element)) {
        return null;
      }
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const hit = document.elementFromPoint(x, y);
      return hit
        ? {
            tag: hit.tagName.toLowerCase(),
            uf: hit.getAttribute('data-uf'),
            className: hit.className,
          }
        : null;
    })();

    return {
      url: location.href,
      localStorage: {
        hasAccessToken: !!localStorage.getItem('accessToken'),
        accountId: localStorage.getItem('accountId'),
        hasRequestToken: !!localStorage.getItem('requestToken'),
      },
      dropdown: describeElement(dropdown),
      button: describeElement(button),
      content: describeElement(content),
      dropdownMatchesHover: dropdown?.matches(':hover') ?? false,
      accountMenu: {
        attached: !!accountMenu,
        innerText: accountMenu?.textContent?.trim() ?? null,
      },
      contentText: content?.textContent?.trim() ?? null,
      loginCount: document.querySelectorAll(
        '[data-uf="profile-menu-item-login"]',
      ).length,
      signoutCount: document.querySelectorAll(
        '[data-uf="profile-menu-item-signout"]',
      ).length,
      elementAtButtonCenter,
    };
  });

  return {
    timestamp: new Date().toISOString(),
    viewport,
    playwrightVisible,
    dom,
  };
}

export function finishMenuDebug(outcome: 'passed' | 'failed'): void {
  if (!logFilePath) {
    return;
  }
  append(`=== finished: ${outcome} at ${new Date().toISOString()} ===`);
  // eslint-disable-next-line no-console
  console.log(`[menu-debug] log saved: ${logFilePath}`);
}
