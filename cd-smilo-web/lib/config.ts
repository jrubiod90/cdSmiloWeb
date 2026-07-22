/**
 * Season registration switch.
 *
 * Set to `true` when trials are done and players who passed should be able to
 * fill in the registration form at /inscripcion. Set to `false` in the off-season
 * to show trial info instead of the form.
 *
 * You can also drive this from an env var without touching code:
 *   NEXT_PUBLIC_SEASON_OPEN=true
 */
export const seasonOpen: boolean =
  process.env.NEXT_PUBLIC_SEASON_OPEN !== 'false'

/**
 * Base path the site is served under (e.g. '/cdSmiloWeb' on GitHub Pages, '' locally
 * and on Vercel). Must match `basePath` in next.config.mjs. `next/image` doesn't
 * prepend it automatically when `images.unoptimized` is set, so any hand-built image
 * src under /public needs `${basePath}/...`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * URL of the Google Apps Script web app that receives the registration form,
 * stores the uploaded documents in the club's Drive and appends a row to the
 * responses spreadsheet. See `docs/registration-backend.md` for how to deploy it.
 *
 * Set it (without touching code) via:
 *   NEXT_PUBLIC_REGISTRATION_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
 *
 * When empty, the form runs in demo mode: it validates and shows the success
 * screen but does NOT send anything, so you can preview it before wiring Drive.
 */
export const registrationEndpoint =
  process.env.NEXT_PUBLIC_REGISTRATION_ENDPOINT || ''
