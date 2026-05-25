/** TMDB OAuth UI selectors (ported from legacy movies-user-flows fixtures). */

export const tmdbAuthUrlPart = 'www.themoviedb.org/auth/access';
export const tmdbLoginUrlPart = 'www.themoviedb.org/login';
export const tmdbApproveBtn = 'input[value="Approve"]';
export const tmdbCookieRejectAllBtn = '#onetrust-reject-all-handler';
export const tmdbLoginBtn =
  '#main > section > div > div > div:nth-child(2) > a';
export const tmdbUsernameInput = '#username';
export const tmdbPasswordInput = '#password';
export const tmdbLoginSubmitBtn = '#login_button';

/** OAuth flows hit external TMDB pages; allow ample time per step. */
export const tmdbAuthStepTimeout = 120_000;

export const tmdbE2eUser = process.env['TMDB_E2E_USER'] ?? 'angular-movies';
export const tmdbE2ePassword =
  process.env['TMDB_E2E_PASSWORD'] ?? 'angular4242';

export const hasTmdbE2eCredentials = Boolean(tmdbE2eUser && tmdbE2ePassword);
